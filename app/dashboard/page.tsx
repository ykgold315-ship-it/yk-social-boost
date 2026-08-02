import StatCard from "../components/dashboard/StatCard";
import { createClient } from "../../lib/server-client";
import {
  Wallet,
  ShoppingBag,
  Clock3,
  CheckCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: credits }, { data: orders }, { data: profile }] =
    await Promise.all([
      supabase
        .from("credits")
        .select("credits")
        .eq("user_id", user.id)
        .single(),

      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single(),
    ]);

  const totalOrders = orders?.length ?? 0;

  const pendingOrders =
    orders?.filter((o: any) => o.status === "Pending").length ?? 0;

  const completedOrders =
    orders?.filter((o: any) => o.status === "Completed").length ?? 0;

  const creditBalance = credits?.credits ?? 0;

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Welcome back,
          <span className="text-blue-500">
            {" "}
            {profile?.full_name ?? "User"}
          </span>
        </h1>

        <p className="mt-3 text-slate-400">
          Here's an overview of your account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Credits"
          value={Number(creditBalance).toLocaleString()}
          icon={<Wallet />}
          color="text-green-400"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingBag />}
          color="text-blue-400"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock3 />}
          color="text-yellow-400"
        />

        <StatCard
          title="Completed Orders"
          value={completedOrders}
          icon={<CheckCircle />}
          color="text-emerald-400"
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">

          <h2 className="text-2xl font-bold mb-6">
            Recent Orders
          </h2>

          {orders?.length ? (

            <div className="space-y-4">

              {orders.slice(0, 5).map((order: any) => (

                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
                >

                  <div>
                    <p className="font-semibold">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-slate-400">
                      Quantity: {order.quantity}
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm">
                    {order.status}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-slate-400">
              No orders yet.
            </p>

          )}

        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">

          <h2 className="text-2xl font-bold mb-8">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <a
              href="/dashboard/add-funds"
              className="rounded-xl bg-blue-600 py-4 text-center font-semibold hover:bg-blue-700"
            >
              Add Funds
            </a>

            <a
              href="/dashboard/orders/new"
              className="rounded-xl bg-slate-800 py-4 text-center hover:bg-slate-700"
            >
              New Order
            </a>

            <a
              href="/dashboard/services"
              className="rounded-xl bg-slate-800 py-4 text-center hover:bg-slate-700"
            >
              Services
            </a>

            <a
              href="/dashboard/orders"
              className="rounded-xl bg-slate-800 py-4 text-center hover:bg-slate-700"
            >
              My Orders
            </a>

          </div>

        </div>

      </div>
    </>
  );
}