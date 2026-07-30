const delivery = require("./core/delivery");
const generateTasks = require("./core/taskGenerator");
require("dotenv").config();

const supabase = require("./config");

console.log("=================================");
console.log("YK Automation Worker Started...");
console.log("=================================");

async function processJobs() {
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

    const job = jobs[0];

    console.log(`Processing Job #${job.id}`);

    // Update Job
    await supabase
      .from("automation_jobs")
      .update({
        status: "Processing",
        progress: 10,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    // Load Order
    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", job.order_id)
        .single();

    if (orderError || !order) {
      throw new Error("Order not found.");
    }

    // Load Service
    const { data: service, error: serviceError } =
      await supabase
        .from("services")
        .select("*")
        .eq("id", order.service_id)
        .single();

    if (serviceError || !service) {
      throw new Error("Service not found.");
    }

    // Update Order
    await supabase
      .from("orders")
      .update({
        status: "Processing",
        progress: 20,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    // Generate Tasks
    const tasks = await generateTasks(
      job,
      order,
      service,
      supabase
    );

    console.log(`${tasks.length} tasks ready.`);

    // Process Tasks
    let completed = 0;

    for (const task of tasks) {

      await delivery(
        task,
        order,
        job,
        supabase
      );

      completed++;

      const progress = Math.floor(
        (completed / tasks.length) * 100
      );

      await supabase
        .from("automation_jobs")
        .update({
          progress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      await supabase
        .from("orders")
        .update({
          progress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

    }

    // Finish Job
    await supabase
      .from("automation_jobs")
      .update({
        status: "Completed",
        progress: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    await supabase
      .from("orders")
      .update({
        status: "Completed",
        progress: 100,
        remains: 0,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    console.log(`✅ Job #${job.id} Completed`);

  } catch (err) {
    console.error(err);
  }
}

processJobs();

setInterval(processJobs, 5000);