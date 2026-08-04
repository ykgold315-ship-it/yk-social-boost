import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

function normalizeProviderError(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.error === "string") {
      return record.error;
    }

    if (typeof record.message === "string") {
      return record.message;
    }

    if (typeof record.details === "string") {
      return record.details;
    }

    if (Array.isArray(record.error)) {
      return record.error.join(", ");
    }
  }

  return null;
}

async function markJobFailed(
  supabase: typeof adminClient,
  jobId: number | string,
  orderId: number | string | null,
  errorMessage: string
) {
  await supabase.from("automation_jobs").update({
    status: "Failed",
    progress: 0,
    error: errorMessage,
    completed_at: new Date().toISOString(),
  }).eq("id", jobId);

  if (orderId !== null && orderId !== undefined) {
    await supabase.from("orders").update({
      status: "Failed",
      updated_at: new Date().toISOString(),
    }).eq("id", orderId);
  }
}

export async function GET(request: Request) {
  try {
    const workerSecret = process.env.WORKER_SECRET;
    const authHeader = request.headers.get("authorization");

    if (workerSecret && authHeader !== `Bearer ${workerSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const supabase = adminClient;
const test = await supabase
  .from("services")
  .select("*")
  .eq("id", 4)
  .single();

console.log("TEST SERVICE:", test);
    const queuedJobsResult = await supabase
      .from("automation_jobs")
      .select("id, order_id")
      .eq("status", "Queued")
      .order("id", { ascending: true })
      .limit(1);

    if (queuedJobsResult.error) {
      console.error("Failed to load queued automation job", queuedJobsResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to load queued automation job.",
          details: queuedJobsResult.error.message,
        },
        { status: 500 }
      );
    }

    const job = Array.isArray(queuedJobsResult.data)
      ? (queuedJobsResult.data[0] as { id: number; order_id: number | string } | null)
      : null;

    if (!job) {
      return NextResponse.json({
        success: true,
        message: "No queued jobs",
      });
    }

    const orderResult = await supabase
      .from("orders")
      .select("id, service_id, link, quantity, provider_id, provider_order_id, status, progress")
      .eq("id", job.order_id)
      .limit(1);

    if (orderResult.error) {
      console.error("Failed to load order", orderResult.error);
      await markJobFailed(supabase, job.id, null, "Order not found");
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    const order = Array.isArray(orderResult.data)
      ? (orderResult.data[0] as {
          id: number;
          service_id: number | string | null;
          link: string | null;
          quantity: number | string | null;
          provider_id: number | string | null;
          provider_order_id: string | null;
          status: string | null;
          progress: number | null;
        } | null)
      : null;

    if (!order) {
      await markJobFailed(supabase, job.id, null, "Order not found");
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    const {
      data: service,
      error: serviceError,
    } = await supabase
      .from("services")
      .select("*")
      .eq("id", order.service_id)
      .single();

    console.log("ORDER SERVICE ID:", order.service_id);
    console.log("SERVICE:", service);
    console.log("SERVICE ERROR:", serviceError);

    if (serviceError) {
      console.error(serviceError);

      await markJobFailed(
        supabase,
        job.id,
        order.id,
        serviceError.message
      );

      return NextResponse.json(
        {
          success: false,
          error: serviceError.message,
        },
        { status: 500 }
      );
    }

    if (!service) {
      await markJobFailed(
        supabase,
        job.id,
        order.id,
        "Service not found."
      );

      return NextResponse.json(
        {
          success: false,
          error: "Service not found.",
        },
        { status: 404 }
      );
    }

    if (
      service.provider_service_id === null ||
      service.provider_service_id === undefined
    ) {
      await markJobFailed(
        supabase,
        job.id,
        order.id,
        "provider_service_id is NULL"
      );

      return NextResponse.json(
        {
          success: false,
          error: "provider_service_id is NULL",
        },
        { status: 400 }
      );
    }

    const providerResult = await supabase
      .from("providers")
      .select("id, api_key, api_url")
      .eq("status", "Active")
      .order("priority", { ascending: true })
      .limit(1);

    if (providerResult.error) {
      console.error("Failed to load provider", providerResult.error);
      await markJobFailed(supabase, job.id, order.id, "No active provider available.");
      return NextResponse.json(
        {
          success: false,
          error: "No active provider available.",
        },
        { status: 400 }
      );
    }

    const provider = Array.isArray(providerResult.data)
      ? (providerResult.data[0] as { id: number; api_key: string | null; api_url: string | null } | null)
      : null;

    if (!provider || !provider.api_key || !provider.api_url) {
      await markJobFailed(supabase, job.id, order.id, "No active provider available.");
      return NextResponse.json(
        {
          success: false,
          error: "No active provider available.",
        },
        { status: 400 }
      );
    }

    await supabase.from("automation_jobs").update({
      status: "Processing",
      progress: 20,
      started_at: new Date().toISOString(),
    }).eq("id", job.id);

    await supabase.from("orders").update({
      status: "Processing",
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    const body = new URLSearchParams();
    body.append("key", provider.api_key);
    body.append("action", "add");
    body.append("service", String(service.provider_service_id));
    body.append("link", String(order.link ?? ""));
    body.append("quantity", String(order.quantity ?? ""));

    let response: Response;

    try {
      response = await fetch(provider.api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
    } catch (networkError) {
      await markJobFailed(supabase, job.id, order.id, "Network error");
      return NextResponse.json(
        {
          success: false,
          error: "Network error",
          details: networkError instanceof Error ? networkError.message : String(networkError),
        },
        { status: 502 }
      );
    }

    const responseText = await response.text();
    let providerPayload: unknown = null;

    try {
      providerPayload = JSON.parse(responseText);
    } catch {
      await markJobFailed(supabase, job.id, order.id, "Invalid provider response.");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid provider response.",
          details: responseText,
        },
        { status: 502 }
      );
    }

    const providerErrorMessage = normalizeProviderError(
      (providerPayload as { error?: unknown; message?: unknown } | null)?.error ??
      (providerPayload as { error?: unknown; message?: unknown } | null)?.message
    );

    if (providerErrorMessage && providerErrorMessage.toLowerCase().includes("not enough funds")) {
      await supabase.from("automation_jobs").update({
        status: "Failed",
        progress: 0,
        error: "Provider has insufficient balance",
        completed_at: new Date().toISOString(),
      }).eq("id", job.id);

      await supabase.from("orders").update({
        status: "Failed",
        updated_at: new Date().toISOString(),
      }).eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          error: "Provider has insufficient balance",
          provider_response: providerPayload,
        },
        { status: 502 }
      );
    }

    if (!response.ok || providerErrorMessage || !providerPayload || typeof providerPayload !== "object") {
      const errorMessage = providerErrorMessage ?? `Provider request failed with status ${response.status}`;
      await markJobFailed(supabase, job.id, order.id, errorMessage);
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          provider_response: providerPayload,
        },
        { status: 502 }
      );
    }

    const payload = providerPayload as { order?: unknown };

    if (payload.order === undefined || payload.order === null || payload.order === "") {
      await markJobFailed(supabase, job.id, order.id, "Invalid provider response.");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid provider response.",
          provider_response: providerPayload,
        },
        { status: 502 }
      );
    }

    const providerOrderId = String(payload.order);

    await supabase.from("orders").update({
      provider_id: provider.id,
      provider_order_id: providerOrderId,
      status: "Processing",
      progress: 25,
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    await supabase.from("automation_jobs").update({
      status: "Completed",
      progress: 100,
      completed_at: new Date().toISOString(),
    }).eq("id", job.id);

    return NextResponse.json({
      success: true,
      provider_order_id: providerOrderId,
    });
  } catch (error) {
    console.error("Worker exception", error);
    return NextResponse.json(
      {
        success: false,
        error: "Worker Failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
