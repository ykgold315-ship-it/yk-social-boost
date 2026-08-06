import { createClient } from "./server-client";
import { createNotification } from "./notifications";
import { submitOrderToProvider, ProviderRecord } from "./provider-client";

export type OrderCreatePayload = {
  service_id: number;
  link: string;
  quantity: number;
};

export type OrderRecord = {
  id: number;
  user_id: string;
  service_id: number;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  progress: number;
  remains: number;
  start_count: number;
  provider_id?: number | null;
  provider_order_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ServiceRecord = {
  id: number;
  price: number;
  selling_price?: number | null;
  provider_service_id: string | null;
  active: boolean;
};

export type ProviderLookup = {
  id: number;
  api_url: string;
  api_key: string;
  status: string;
};

export type CreditRecord = {
  id: number;
  user_id: string;
  credits: number;
};

export type WorkerSuccessResult = {
  success: true;
  provider_order_id: string;
  rawResponse: unknown;
};

export type WorkerNoJobResult = {
  success: false;
  message: string;
};

export type WorkerFailureResult = {
  success: false;
  error: string;
};

export type WorkerResult = WorkerSuccessResult | WorkerNoJobResult | WorkerFailureResult;

export async function createOrder(
  userId: string,
  payload: OrderCreatePayload
) {
  const supabase = await createClient();

  if (!payload.link || typeof payload.link !== "string") {
    return { error: "Link is required." };
  }

  if (!payload.service_id || typeof payload.service_id !== "number") {
    return { error: "Service ID is required." };
  }

  if (!payload.quantity || payload.quantity <= 0) {
    return { error: "Quantity must be greater than zero." };
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, price, selling_price, provider_service_id, active")
    .eq("id", payload.service_id)
    .single();

  if (serviceError || !service) {
    return { error: "Service not found." };
  }

  if (!service.active) {
    return { error: "Service is not active." };
  }

  if (
    service.provider_service_id === null ||
    service.provider_service_id === undefined ||
    String(service.provider_service_id).trim() === "" ||
    String(service.provider_service_id).trim() === "0"
  ) {
    return {
      error:
        "Service mapping missing. provider_service_id is required.",
    };
  }

 const sellingPrice = Number(service.selling_price || 0);
const basePrice = Number(service.price || 0);

const servicePrice =
  sellingPrice > 0
    ? sellingPrice
    : basePrice;

  if (Number.isNaN(servicePrice) || servicePrice <= 0) {
    return {
      error: "Service has an invalid price.",
    };
  }

  const charge = Number(
    ((servicePrice * payload.quantity) / 1000).toFixed(2)
  );

  const { data: creditAccount, error: creditError } = await supabase
    .from("credits")
    .select("id, user_id, credits")
    .eq("user_id", userId)
    .single();

  if (creditError || !creditAccount) {
    return { error: "Credit account not found." };
  }

  if (Number(creditAccount.credits) < charge) {
    return { error: "Insufficient credits." };
  }

  const { error: deductError } = await supabase
    .from("credits")
    .update({ credits: Number(creditAccount.credits) - charge })
    .eq("id", creditAccount.id);

  if (deductError) {
    return { error: `Failed to deduct credits: ${deductError.message}` };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      service_id: payload.service_id,
      link: payload.link,
      quantity: payload.quantity,
      charge,
      status: "Pending",
      progress: 0,
      remains: payload.quantity,
      start_count: 0,
      provider_id: null,
      provider_order_id: null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: `Failed to create order: ${orderError?.message}` };
  }

  const { error: jobError } = await supabase
    .from("automation_jobs")
    .insert({
      order_id: order.id,
      user_id: order.user_id,
      service_id: order.service_id,
      status: "Queued",
      progress: 0,
      started_at: null,
      completed_at: null,
      error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (jobError) {
    return { error: `Failed to create automation job: ${jobError.message}` };
  }

  await createNotification({
    title: "New Order Created",
    message: `Order #${order.id} has been queued for processing.`,
    type: "success",
    userId,
  });

  return { order };
}

export async function processNextJobRequest(secret: string | null): Promise<WorkerResult> {
  const workerSecret = process.env.WORKER_SECRET;
  if (!workerSecret) {
    throw new Error("Worker secret is not configured.");
  }

  if (workerSecret !== secret) {
    throw new Error("Unauthorized worker request.");
  }

  return await processNextJobInternal();
}

export async function processNextJobInternal(): Promise<WorkerResult> {
  const supabase = await createClient();

  const { data: job, error: jobError } = await supabase
    .from("automation_jobs")
    .select("id, order_id")
    .eq("status", "Queued")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (jobError) {
    throw new Error(`Failed to load queued job: ${jobError.message}`);
  }

  if (!job) {
    return { success: false, message: "No queued jobs." };
  }

  return await processJob(job.id, job.order_id);
}

async function processJob(jobId: number, orderId: number): Promise<WorkerResult> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, service_id, link, quantity, status, progress")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    await markJobFailed(jobId, orderId, "Order not found.");
    return { success: false, error: "Order not found." };
  }

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from("services")
    .select("id, provider_service_id, active")
    .eq("id", order.service_id)
    .single();

  if (serviceError || !service) {
    await markJobFailed(jobId, order.id, "Service not found.");
    return { success: false, error: "Service not found." };
  }

  if (!service.active) {
    await markJobFailed(jobId, order.id, "Service is inactive.");
    return { success: false, error: "Service is inactive." };
  }

  const providerServiceId = String(service.provider_service_id ?? "").trim();
  if (!providerServiceId || providerServiceId === "0") {
    await markJobFailed(jobId, order.id, "Service provider_service_id is missing.");
    return { success: false, error: "Service provider_service_id is missing." };
  }

  const {
    data: provider,
    error: providerError,
  } = await supabase
    .from("providers")
    .select("id, api_url, api_key, status")
    .eq("status", "Active")
    .order("priority", { ascending: true })
    .limit(1)
    .single();

  if (providerError || !provider) {
    await markJobFailed(jobId, order.id, "No active provider available.");
    return { success: false, error: "No active provider available." };
  }

  await supabase.from("automation_jobs").update({
    status: "Processing",
    progress: 20,
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", jobId);

  await supabase.from("orders").update({
    status: "Processing",
    progress: 10,
    updated_at: new Date().toISOString(),
  }).eq("id", order.id);

  let providerResult;
  try {
    providerResult = await submitOrderToProvider(
      provider as ProviderRecord,
      providerServiceId,
      String(order.link),
      Number(order.quantity)
    );
  } catch (providerErrorResult) {
    const message =
      providerErrorResult instanceof Error
        ? providerErrorResult.message
        : String(providerErrorResult);

    await markJobFailed(jobId, order.id, message);
    return { success: false, error: message };
  }

  await supabase.from("orders").update({
    status: "Processing",
    progress: 50,
    provider_id: provider.id,
    provider_order_id: providerResult.providerOrderId,
    updated_at: new Date().toISOString(),
  }).eq("id", order.id);

  await supabase.from("automation_jobs").update({
    status: "Completed",
    progress: 100,
    completed_at: new Date().toISOString(),
    error: null,
    updated_at: new Date().toISOString(),
  }).eq("id", jobId);

  return {
    success: true,
    provider_order_id: providerResult.providerOrderId,
    rawResponse: providerResult.rawResponse,
  };
}

async function markJobFailed(
  jobId: number,
  orderId: number,
  errorMessage: string
) {
  const supabase = await createClient();

  await supabase.from("automation_jobs").update({
    status: "Failed",
    progress: 0,
    error: errorMessage,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", jobId);

  await supabase.from("orders").update({
    status: "Failed",
    updated_at: new Date().toISOString(),
  }).eq("id", orderId);
}
