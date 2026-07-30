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

    // Wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 400 }
      );
    }

    if (Number(wallet.balance) < Number(charge)) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
        { status: 400 }
      );
    }

    // Deduct balance
    const { error: balanceError } = await supabase
      .from("wallets")
      .update({
        balance: Number(wallet.balance) - Number(charge),
      })
      .eq("id", wallet.id);

    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 400 }
      );
    }

    // Create Order
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

    // Queue Automation
    await supabase
      .from("automation_jobs")
      .insert({
        order_id: order.id,
        user_id: order.user_id,
        service_id: order.service_id,
        status: "Queued",
        progress: 0,
      });

    // Notification
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