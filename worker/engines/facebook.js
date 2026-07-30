const brain = require("../brain");
const delivery = require("../core/delivery");

module.exports = async function(job, supabase) {

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", job.service_id)
    .single();

  const plan = await brain(job, service);

  console.log("Executing Facebook Plan...");

  await delivery(job, service, supabase);

};