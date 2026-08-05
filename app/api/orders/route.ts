import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";
import { createOrder, processNextJobInternal } from "@/lib/order-service";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const service_id = Number(body.service_id);
    const link = String(body.link ?? "").trim();
    const quantity = Number(body.quantity);

    if (!service_id) {
      return NextResponse.json(
        { error: "service_id is required." },
        { status: 400 }
      );
    }

    if (!link) {
      return NextResponse.json(
        { error: "link is required." },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "quantity must be greater than zero." },
        { status: 400 }
      );
    }

    const result = await createOrder(user.id, {
      service_id,
      link,
      quantity,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    try {
      await processNextJobInternal();
    } catch (workerError) {
      console.error("Worker processing failed:", workerError);
    }

    return NextResponse.json({
      success: true,
      order: result.order,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Order creation error:", message);
    return NextResponse.json(
      { error: "Server error during order creation." },
      { status: 500 }
    );
  }
}
