module.exports = async function generateTasks(
  job,
  order,
  service,
  supabase
) {
  const quantity = Number(order.quantity);

  const chunkSize = 100;

  const totalTasks = Math.ceil(quantity / chunkSize);

  const tasks = [];

  for (let i = 0; i < totalTasks; i++) {
    const amount =
      i === totalTasks - 1
        ? quantity - chunkSize * i
        : chunkSize;

    const task = {
      job_id: job.id,
      order_id: order.id,
      platform: service.category,
      action: service.name,
      target: order.link,
      quantity: amount,
      progress: 0,
      status: "Pending",
    };

    await supabase
      .from("automation_tasks")
      .insert(task);

    tasks.push(task);
  }

  console.log(`${tasks.length} tasks created.`);

  return tasks;
};