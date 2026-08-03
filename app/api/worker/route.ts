import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const supabase = await createApiClient();

    // Get oldest queued job
    const { data: job } = await supabase
      .from("automation_jobs")
      .select("*")
      .eq("status", "Queued")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (!job) {
      return NextResponse.json({
        success: false,
        message: "No queued jobs.",
      });
    }

    // Get Order
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", job.order_id)
      .single();

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Get Provider
    const { data: provider } = await supabase
      .from("providers")
      .select("*")
      .eq("status", "Active")
      .order("priority")
      .limit(1)
      .single();

    if (!provider) {
      return NextResponse.json(
        {
          error: "No active provider.",
        },
        {
          status: 400,
        }
      );
    }

    // Processing
    await supabase
      .from("automation_jobs")
      .update({
        status: "Processing",
        progress: 20,
        started_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    await supabase
      .from("orders")
      .update({
        status: "Processing",
      })
      .eq("id", order.id);

    // Send Order To JAP
    const body = new URLSearchParams();

    body.append("key", provider.api_key);
    body.append("action", "add");

    body.append("service", String(order.service_id));
    body.append("link", order.link);
    body.append("quantity", String(order.quantity));

    const response = await fetch(provider.api_url, {
      method: "POST",
      body,
    });

    const result = await response.json();

    if (result.error) {

      await supabase
        .from("automation_jobs")
        .update({
          status: "Failed",
          progress: 0,
          error: result.error,
        })
        .eq("id", job.id);

      await supabase
        .from("orders")
        .update({
          status: "Failed",
        })
        .eq("id", order.id);

      return NextResponse.json(result);
    }

    // Save Provider Order ID
    await supabase
      .from("orders")
      .update({
        provider_id: provider.id,
        provider_order_id: String(result.order),
      })
      .eq("id", order.id);

    // Complete Job
    await supabase
      .from("automation_jobs")
      .update({
        status: "Completed",
        progress: 100,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    return NextResponse.json({
      success: true,
      provider_order: result.order,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "Worker Failed",
      },
      {
        status: 500,
      }
    );
  }
}