module.exports = async function brain(job, service) {

  console.log("=================================");
  console.log("YK DELIVERY BRAIN");
  console.log("=================================");

  const plan = {
    orderId: job.order_id,
    jobId: job.id,
    serviceId: service.id,
    platform: service.platform,
    serviceName: service.name,
    quantity: job.quantity,
    mode: "AI",
    status: "READY",
    created: new Date().toISOString()
  };

  console.log("Delivery Plan Created:");
  console.log(plan);

  return plan;
};