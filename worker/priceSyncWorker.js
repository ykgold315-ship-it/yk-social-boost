require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncPrices() {
  console.log("=================================");
  console.log("Price Sync Started...");
  console.log("=================================");

  const { data: providers } = await supabase
    .from("providers")
    .select("*")
    .eq("status", "Active");

  if (!providers || providers.length === 0) {
    console.log("No active providers.");
    return;
  }

  for (const provider of providers) {
    console.log("Syncing:", provider.name);

    try {

      const response = await fetch(provider.api_url, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          key: provider.api_key,
          action: "services",
        }),
      });

      const services = await response.json();

      if (!Array.isArray(services)) {
        continue;
      }

      for (const service of services) {

        await supabase
          .from("provider_services")
          .update({
            rate: Number(service.rate),
            min: Number(service.min),
            max: Number(service.max),
          })
          .eq(
            "provider_service_id",
            String(service.service)
          );

      }

      console.log(
        provider.name,
        "updated",
        services.length,
        "services."
      );

    } catch (err) {

      console.log(err.message);

    }
  }

  console.log("=================================");
  console.log("Price Sync Finished");
  console.log("=================================");
}

syncPrices();