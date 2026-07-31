const sendOrder = require("../providers/client");

module.exports = async function delivery(
  task,
  order,
  job,
  supabase
) {

  console.log("=================================");
  console.log("Finding Provider Mapping...");
  console.log("=================================");

  // Find provider service mapping
  const { data: providerService, error: mappingError } =
    await supabase
      .from("provider_services")
      .select(`
        *,
        providers(*)
      `)
      .eq("service_id", order.service_id)
      .limit(1)
      .single();

  if (mappingError || !providerService) {
    throw new Error(
      "No Provider Mapping Found."
    );
  }

  const provider = providerService.providers;

  console.log("Provider:", provider.name);
  console.log(
    "Provider Service:",
    providerService.provider_service_id
  );

  // Send Order to JAP
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
  throw new Error(
    "Provider did not return an order ID."
  );
}

  // Save provider order
  await supabase
    .from("provider_orders")
    .insert({
      provider_id: provider.id,

      automation_job_id: job.id,

      order_id: order.id,

      provider_order_id: String(result.order),

      status: "Pending",

      created_at: new Date().toISOString(),
    });

  // Update task
  await supabase
    .from("automation_tasks")
    .update({
      status: "Completed",
      progress: 100,
    })
    .eq("job_id", job.id)
    .eq("order_id", order.id)
    .eq("target", task.target);

  return result;
};