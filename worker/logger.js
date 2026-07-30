module.exports = async function log(
  supabase,
  job,
  message,
  progress = null
) {
  try {
    await supabase
      .from("automation_logs")
      .insert({
        job_id: job.id,
        order_id: job.order_id,
        message,
        progress,
      });

    console.log(message);

  } catch (err) {
    console.log("Logger Error:", err.message);
  }
};