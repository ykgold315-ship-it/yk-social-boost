const axios = require("axios");

module.exports = async function getStatus(
  provider,
  providerOrderId
) {
  try {
    const response = await axios.post(
      provider.api_url,
      new URLSearchParams({
        key: provider.api_key,
        action: "status",
        order: providerOrderId,
      }),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;

  } catch (err) {

    console.error(
      err.response?.data || err.message
    );

    throw err;

  }
};