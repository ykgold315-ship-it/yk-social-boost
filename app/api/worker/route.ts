import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function GET() {
  try {
    const supabase = adminClient;

    const { data: queuedJob, error: queuedJobError } = await supabase
      .from("automation_jobs")
      .select("*")
      .eq("status", "Queued")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (queuedJobError) {
      console.error("Failed to load queued automation job", queuedJobError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to load queued automation job.",
          details: queuedJobError.message,
        },
        { status: 500 }
      );
    }

    if (!queuedJob) {
      return NextResponse.json({
        success: false,
        message: "No queued jobs.",
      });
    }

    const { data: orderRecord, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", queuedJob.order_id)
      .single();

    if (orderError || !orderRecord) {
      console.error("Order lookup failed", orderError || "Missing order");
      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    const { data: serviceRecord, error: serviceError } = await supabase
      .from("services")
      .select("provider_service_id")
      .eq("id", orderRecord.service_id)
      .single();

    const serviceLookupValues = {
      orderServiceId: orderRecord.service_id,
      serviceRecord,
      serviceError,
      providerServiceId:
        serviceRecord?.provider_service_id ?? null,
    };

    if (
      serviceError ||
      !serviceRecord ||
      serviceRecord.provider_service_id == null ||
      String(serviceRecord.provider_service_id).trim() === "" ||
      String(serviceRecord.provider_service_id).trim() === "0"
    ) {
      const errorMessage =
        serviceError?.message || "Missing provider_service_id for local service.";
      console.error("Service lookup failed", serviceLookupValues);

      const { error: failJobError } = await supabase
        .from("automation_jobs")
        .update({
          status: "Failed",
          progress: 0,
          error: errorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq("id", queuedJob.id);

      if (failJobError) {
        console.error("Failed to mark automation job failed", failJobError);
      }

      const { error: failOrderError } = await supabase
        .from("orders")
        .update({
          status: "Failed",
        })
        .eq("id", orderRecord.id);

      if (failOrderError) {
        console.error("Failed to mark order failed", failOrderError);
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 400 }
      );
    }

    const { data: providerRecord, error: providerError } = await supabase
      .from("providers")
      .select("id, api_key, api_url")
      .eq("status", "Active")
      .order("priority")
      .limit(1)
      .single();

    if (providerError || !providerRecord || !providerRecord.api_key || !providerRecord.api_url) {
      console.error("Provider lookup failed", providerError || providerRecord);

      await supabase
        .from("automation_jobs")
        .update({
          status: "Failed",
          progress: 0,
          error: "No active provider available.",
          completed_at: new Date().toISOString(),
        })
        .eq("id", queuedJob.id);

      await supabase
        .from("orders")
        .update({
          status: "Failed",
        })
        .eq("id", orderRecord.id);

      return NextResponse.json(
        {
          success: false,
          error: "No active provider available.",
        },
        { status: 400 }
      );
    }

    const { error: processingJobError } = await supabase
      .from("automation_jobs")
      .update({
        status: "Processing",
        progress: 20,
        started_at: new Date().toISOString(),
      })
      .eq("id", queuedJob.id);

    if (processingJobError) {
      console.error("Failed to mark automation job processing", processingJobError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update job status.",
        },
        { status: 500 }
      );
    }

    const { error: processingOrderError } = await supabase
      .from("orders")
      .update({
        status: "Processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderRecord.id);

    if (processingOrderError) {
      console.error("Failed to mark order processing", processingOrderError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order status.",
        },
        { status: 500 }
      );
    }

    const body = new URLSearchParams();
    body.append("key", providerRecord.api_key);
    body.append("action", "add");
    body.append("service", String(serviceRecord.provider_service_id));
    body.append("link", String(orderRecord.link || ""));
    body.append("quantity", String(orderRecord.quantity));

    const response = await fetch(providerRecord.api_url, {
      method: "POST",
      body,
    });

    const responseText = await response.text();
    let providerResult: any;

    try {
      providerResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JAP response", parseError, responseText);

      await supabase
        .from("automation_jobs")
        .update({
          status: "Failed",
          progress: 0,
          error: "Invalid provider response.",
          completed_at: new Date().toISOString(),
        })
        .eq("id", queuedJob.id);

      await supabase
        .from("orders")
        .update({
          status: "Failed",
        })
        .eq("id", orderRecord.id);

      return NextResponse.json(
        {
          success: false,
          error: "Invalid provider response.",
          details: responseText,
        },
        { status: 502 }
      );
    }

    if (!response.ok || providerResult?.error || !providerResult?.order) {
      const providerErrorMessage =
        providerResult?.error || `Provider request failed with status ${response.status}`;
      console.error("JAP order failed", providerErrorMessage, providerResult);

      await supabase
        .from("automation_jobs")
        .update({
          status: "Failed",
          progress: 0,
          error: providerErrorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq("id", queuedJob.id);

      await supabase
        .from("orders")
        .update({
          status: "Failed",
        })
        .eq("id", orderRecord.id);

      return NextResponse.json(
        {
          success: false,
          error: providerErrorMessage,
          provider_response: providerResult,
        },
        { status: 502 }
      );
    }

    const { error: completeOrderError } = await supabase
      .from("orders")
      .update({
        provider_id: providerRecord.id,
        provider_order_id: String(providerResult.order),
        status: "Completed",
        progress: 100,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderRecord.id);

    if (completeOrderError) {
      console.error("Failed to complete order", completeOrderError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save provider order info.",
        },
        { status: 500 }
      );
    }

    const { error: completeJobError } = await supabase
      .from("automation_jobs")
      .update({
        status: "Completed",
        progress: 100,
        completed_at: new Date().toISOString(),
      })
      .eq("id", queuedJob.id);

    if (completeJobError) {
      console.error("Failed to complete automation job", completeJobError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to complete automation job.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      provider_order: providerResult.order,
      provider_id: providerRecord.id,
    });
  } catch (err) {
    console.error("Worker exception", err);

    return NextResponse.json(
      {
        success: false,
        error: "Worker Failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
