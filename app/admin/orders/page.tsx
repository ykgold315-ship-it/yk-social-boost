import Link from "next/link";
import { createClient } from "@/lib/server-client";
import OrderTable from "../../components/admin/OrderTable";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();

  const { count: total } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: pending } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  const { count: completed } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Orders Management
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor and manage customer orders.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Total Orders</p>
          <h2 className="text-4xl font-bold">{total ?? 0}</h2>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Pending</p>
          <h2 className="text-4xl font-bold text-yellow-400">
            {pending ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Completed</p>
          <h2 className="text-4xl font-bold text-green-400">
            {completed ?? 0}
          </h2>
        </div>

      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <form className="flex flex-1 gap-4">

          <input
            type="text"
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Search by Order ID or Link..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 p-3"
          />

          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>

          <button className="rounded-xl bg-blue-600 px-8 hover:bg-blue-700">
            Search
          </button>

        </form>

        <Link
          href="/admin/orders/new"
          className="ml-4 rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
        >
          + New Order
        </Link>

      </div>

      <OrderTable
        search={params.search ?? ""}
        status={params.status ?? ""}
      />

    </div>
  );
}