require("dotenv").config();

const supabase = require("./config");
const getStatus = require("./providers/status");

console.log("=================================");
console.log("Status Worker Started...");
console.log("=================================");

async function checkOrders() {

  try {

    const { data: providerOrders, error } = await supabase
      .from("provider_orders")
      .select(`
        *,
        providers(*),
        orders(*)
      `)
      .neq("status", "Completed")
      .neq("status", "Cancelled");

    if (error) {
      console.error(error);
      return;
    }

    if (!providerOrders || providerOrders.length === 0) {
      console.log("No active provider orders...");
      return;
    }

    for (const item of providerOrders) {

      console.log(
        `Checking Provider Order ${item.provider_order_id}`
      );

      const status = await getStatus(
        item.providers,
        item.provider_order_id
      );

      console.log(status);

      await supabase
        .from("provider_orders")
        .update({
          status: status.status,
          remains: Number(status.remains || 0),
          start_count: Number(status.start_count || 0),
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      await supabase
        .from("orders")
        .update({
          status: status.status,
          remains: Number(status.remains || 0),
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.order_id);

      console.log(
        `Updated Order #${item.order_id}`
      );

    }

  } catch (err) {

    console.error(err);

  }

}

checkOrders();

setInterval(checkOrders, 60000);