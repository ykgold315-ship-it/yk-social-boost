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
    } = body;

    if (!service_id || !link || !quantity) {
      return NextResponse.json(
        { error: "service_id, link and quantity are required." },
        { status: 400 }
      );
    }

    const orderedQuantity = Number(quantity);
    if (orderedQuantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than zero." },
        { status: 400 }
      );
    }

    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id, price, selling_price, provider_service_id, active")
      .eq("id", service_id)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    if (!service.active) {
      return NextResponse.json(
        { error: "Service is not active." },
        { status: 400 }
      );
    }

    if (
      service.provider_service_id == null ||
      String(service.provider_service_id).trim() === "" ||
      String(service.provider_service_id).trim() === "0"
    ) {
      return NextResponse.json(
        { error: "Service is not mapped to a provider service." },
        { status: 400 }
      );
    }

    const servicePrice =
      service.selling_price != null
        ? Number(service.selling_price)
        : Number(service.price);

    if (Number.isNaN(servicePrice) || servicePrice <= 0) {
      return NextResponse.json(
        { error: "Service has invalid price." },
        { status: 400 }
      );
    }

    const charge = Number(((servicePrice * orderedQuantity) / 1000).toFixed(2));

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

    if (Number(creditAccount.credits) < charge) {
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
        credits: Number(creditAccount.credits) - charge,
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
        quantity: orderedQuantity,
        charge,
        status: "Pending",
        progress: 0,
        remains: orderedQuantity,
        start_count: 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || "Failed to create order." },
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
    // IMMEDIATE WORKER TRIGGER
    // =====================================

    try {
      const workerUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/worker`
        : null;

      if (workerUrl) {
        await fetch(workerUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.WORKER_SECRET || ""}`,
          },
        });
      }
    } catch (workerError) {
      console.error("Failed to trigger worker", workerError);
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