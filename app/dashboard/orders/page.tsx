import { createClient } from "../../../lib/server-client";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      services(
  id,
  name,
  category
)
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className="text-4xl font-bold">
        My Orders
      </h1>

      <p className="mt-2 text-slate-400">
        Track all your orders.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <table className="w-full">

          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Service</th>
              <th className="px-6 py-4 text-left">Quantity</th>
              <th className="px-6 py-4 text-left">Charge</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>

            {orders?.map((order) => (

              <tr
                key={order.id}
                className="border-t border-slate-800"
              >
                <td className="px-6 py-5">
                  #{order.id}
                </td>

                <td className="px-6 py-5">
  <div>
    <p className="font-semibold">
      {order.services?.name}
    </p>

    <p className="text-xs text-slate-400">
      {order.services?.category}
    </p>
  </div>
</td>
                <td className="px-6 py-5">
                  {order.quantity}
                </td>

                <td className="px-6 py-5">
                  £{Number(order.charge).toFixed(2)}
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-sm">
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}