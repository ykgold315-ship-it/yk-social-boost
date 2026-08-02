import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/api-client";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const supabase = await createApiClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      service_id,
      link,
      quantity,
      charge,
    } = body;

    // =====================================
    // GET USER CREDITS
    // =====================================

    const { data: creditAccount, error: creditError } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditError || !creditAccount) {
      return NextResponse.json(
        { error: "Credits account not found" },
        { status: 400 }
      );
    }

    if (Number(creditAccount.credits) < Number(charge)) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // =====================================
    // DEDUCT CREDITS
    // =====================================

    const { error: deductError } = await supabase
      .from("credits")
      .update({
        credits:
          Number(creditAccount.credits) - Number(charge),
      })
      .eq("id", creditAccount.id);

    if (deductError) {
      return NextResponse.json(
        { error: deductError.message },
        { status: 400 }
      );
    }

    // =====================================
    // CREATE ORDER
    // =====================================

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        service_id,
        link,
        quantity,
        charge,
        status: "Pending",
        progress: 0,
        remains: quantity,
        start_count: 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message },
        { status: 400 }
      );
    }

    // =====================================
    // AUTOMATION QUEUE
    // =====================================

    const { error: jobError } = await supabase
      .from("automation_jobs")
      .insert({
        order_id: order.id,
        user_id: order.user_id,
        service_id: order.service_id,
        status: "Queued",
        progress: 0,
      });

    if (jobError) {
      console.error(jobError);

      return NextResponse.json(
        { error: jobError.message },
        { status: 500 }
      );
    }

    // =====================================
    // NOTIFICATION
    // =====================================

    await createNotification({
      title: "New Order",
      message: `Order #${order.id} created successfully.`,
      type: "success",
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}