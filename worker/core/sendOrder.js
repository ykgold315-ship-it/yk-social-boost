const { japRequest } = require("./japClient");

async function sendOrder(provider, service, order) {

  if (!service.provider_service_id) {
    throw new Error("Service is not mapped to a provider.");
  }

  const response = await japRequest(provider, "add", {
    service: service.provider_service_id,
    link: order.link,
    quantity: order.quantity,
  });

  if (!response) {
    throw new Error("No response received from provider.");
  }

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.order) {
    throw new Error("Provider did not return an order ID.");
  }

  return {
    providerOrderId: response.order,
    rawResponse: response,
  };
}

module.exports = {
  sendOrder,
};