const axios = require("axios");

async function japRequest(provider, action, extra = {}) {
  try {
    const payload = {
      key: provider.api_key,
      action,
      ...extra,
    };

    const { data } = await axios.post(
      provider.api_url,
      new URLSearchParams(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 30000,
      }
    );

    return data;

  } catch (err) {

    console.error("JAP API Error");

    if (err.response) {
      console.error(err.response.data);
      return err.response.data;
    }

    throw err;
  }
}

module.exports = {
  japRequest,
};