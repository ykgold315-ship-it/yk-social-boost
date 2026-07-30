const axios = require("axios");

module.exports = async function sendOrder(
  provider,
  providerService,
  order
) {
  console.log("=================================");
  console.log("Sending Order To Provider");
  console.log("=================================");

  console.log("Provider:", provider.name);
  console.log("Service:", providerService.provider_service_id);

  try {
    const response = await axios.post(provider.api_url, {
      key: provider.api_key,
      action: "add",
      service: providerService.provider_service_id,
      link: order.link,
      quantity: order.quantity,
    });

    return response.data;

  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};