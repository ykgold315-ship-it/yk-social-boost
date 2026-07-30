import { createClient } from "@/lib/server-client";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: users },
    { count: orders },
    { count: services },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
  ]);

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  const { count: completedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");

  const { count: pendingDeposits } = await supabase
    .from("deposits")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  const { count: automationJobs } = await supabase
    .from("automation_jobs")
    .select("*", { count: "exact", head: true });

  const { data: deposits } = await supabase
    .from("deposits")
    .select("amount")
    .eq("status", "Approved");

  const totalRevenue =
    deposits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("id", { ascending: false })
    .limit(10);

  const cards = [
    {
      title: "Users",
      value: users ?? 0,
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Orders",
      value: orders ?? 0,
      color: "from-purple-600 to-violet-500",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      color: "from-green-600 to-emerald-500",
    },
    {
      title: "Pending Orders",
      value: pendingOrders ?? 0,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Pending Deposits",
      value: pendingDeposits ?? 0,
      color: "from-pink-600 to-rose-500",
    },
    {
      title: "Automation Jobs",
      value: automationJobs ?? 0,
      color: "from-indigo-600 to-blue-500",
    },
  ];

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome to YK Social Boost Administration.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => (

          <div
            key={card.title}
            className={`rounded-2xl bg-gradient-to-r ${card.color} p-[1px]`}
          >

            <div className="rounded-2xl bg-slate-900 p-6">

              <p className="text-slate-400 text-sm">
                {card.title}
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {card.value}
              </h2>

            </div>

          </div>

        ))}

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold text-white">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-slate-800 text-slate-400">

              <tr>

                <th className="py-3 text-left">Order</th>

                <th className="py-3 text-left">User</th>

                <th className="py-3 text-left">Quantity</th>

                <th className="py-3 text-left">Status</th>

                <th className="py-3 text-left">Charge</th>

              </tr>

            </thead>

            <tbody>

              {recentOrders?.map((order) => (

                <tr
                  key={order.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >

                  <td className="py-4">
                    #{order.id}
                  </td>

                  <td className="py-4">
                    {order.user_id}
                  </td>

                  <td className="py-4">
                    {order.quantity}
                  </td>

                  <td className="py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        order.status === "Completed"
                          ? "bg-green-600"
                          : order.status === "Pending"
                          ? "bg-yellow-600"
                          : order.status === "Processing"
                          ? "bg-blue-600"
                          : "bg-red-600"
                      }`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="py-4">
                    ${order.charge ?? 0}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}