const axios = require("axios");

module.exports = async function sendOrder(provider, service, order) {
  try {
    const response = await axios.post(provider.api_url, {
      key: provider.api_key,
      action: "add",
      service: service.provider_service_id,
      link: order.link,
      quantity: order.quantity,
    });

    return response.data;
  } catch (err) {
    console.error("Provider Error:", err.message);

    throw err;
  }
};