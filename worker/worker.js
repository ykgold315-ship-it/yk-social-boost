require("dotenv").config();

const supabase = require("./config");
const { sendOrder } = require("./core/sendOrder");

console.log("=================================");
console.log("YK SMM Worker Started...");
console.log("=================================");

async function processJobs() {

  let job;
  let order;
  let service;
  let provider;

  try {

    const { data: jobs, error } = await supabase
      .from("automation_jobs")
      .select("*")
      .eq("status", "Queued")
      .order("id", { ascending: true })
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    if (!jobs || jobs.length === 0) {
      console.log("No queued jobs...");
      return;
    }

    job = jobs[0];

    console.log(`Processing Job #${job.id}`);

    await supabase
      .from("automation_jobs")
      .update({
        status: "Processing",
        progress: 5,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    const {
      data: orderData,
      error: orderError,
    } = await supabase
      .from("orders")
      .select("*")
      .eq("id", job.order_id)
      .single();

    if (orderError || !orderData) {
      throw new Error("Order not found.");
    }

    order = orderData;

    // Find provider mapping
const {
  data: providerService,
  error: mappingError,
} = await supabase
  .from("provider_services")
  .select(`
      *,
      providers(*)
  `)
  .eq("service_id", order.service_id)
  .single();

if (mappingError || !providerService) {
  throw new Error("Provider mapping not found.");
}

provider = providerService.providers;

if (!provider) {
  throw new Error("Provider not found.");
}

if (provider.status !== "Active") {
  throw new Error("Provider is inactive.");
}

console.log("=================================");
console.log("Finding Provider Mapping...");
console.log("=================================");
console.log("Provider:", provider.name);
console.log(
  "Provider Service:",
  providerService.provider_service_id
);

console.log("=================================");
console.log("Sending Order To Provider...");
console.log("=================================");

const result = await sendOrder(
  provider,
  providerService,
  order
);

console.log("Provider Response:");
console.log(result);

if (!result) {
  throw new Error("Provider returned nothing.");
}

if (result.error) {
  throw new Error(result.error);
}

if (!result.order) {
  throw new Error("Provider did not return an order ID.");
}

    console.log(result);

    if (!result || result.error) {
      throw new Error(
        result?.error || "Provider API failed."
      );
    }

    await supabase
      .from("orders")
      .update({
       provider_order_id: String(result.order),
        status: "Processing",
        progress: 25,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    await supabase
      .from("provider_orders")
      .insert({
        provider_id: provider.id,
        order_id: order.id,
        provider_order_id: String(result.order),
        status: "Pending",
        created_at: new Date().toISOString(),
      });

    await supabase
      .from("automation_jobs")
      .update({
        status: "Submitted",
        progress: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    console.log(
      `✅ Order #${order.id} submitted successfully.`
    );

  } catch (err) {

    console.log("=================================");
    console.log("WORKER ERROR");
    console.log("=================================");

    console.error(err);

    if (err.stack) {
      console.error(err.stack);
    }

    if (job) {
      await supabase
        .from("automation_jobs")
        .update({
          status: "Queued",
          progress: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    if (order) {
      await supabase
        .from("orders")
        .update({
          status: "Failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    }

    console.log("=================================");

  }

}

processJobs();

setInterval(processJobs, 5000);