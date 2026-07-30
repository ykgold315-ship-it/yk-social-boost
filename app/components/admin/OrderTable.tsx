import Link from "next/link";
import { createClient } from "@/lib/server-client";
import CompleteOrderButton from "./CompleteOrderButton";
import DeleteOrderButton from "./DeleteOrderButton";

export default async function OrderTable({
  search,
  status,
}: {
  search: string;
  status: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(`
      *,
      profiles (
        full_name,
        email
      ),
      services (
        name
      )
    `);

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    const isNumber = !isNaN(Number(search));

    if (isNumber) {
      query = query.eq("id", Number(search));
    } else {
      query = query.ilike("link", `%${search}%`);
    }
  }

  const { data: orders } = await query.order("id", {
    ascending: false,
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-800 p-6">

        <div>
          <h2 className="text-2xl font-bold">
            All Orders
          </h2>

          <p className="text-sm text-slate-400">
            Manage every customer order.
          </p>
        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-950">

            <tr>

              <th className="px-6 py-4 text-left">#</th>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Service
              </th>

              <th className="px-6 py-4 text-left">
                Link
              </th>

              <th className="px-6 py-4 text-left">
                Qty
              </th>

              <th className="px-6 py-4 text-left">
                Charge
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Date
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {orders?.length ? (

              orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t border-slate-800 hover:bg-slate-800"
                >

                  <td className="px-6 py-5">
                    #{order.id}
                  </td>

                  <td className="px-6 py-5">

                    <p className="font-semibold">
                      {order.profiles?.full_name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {order.profiles?.email}
                    </p>

                  </td>

                  <td className="px-6 py-5">
                    {order.services?.name}
                  </td>

                  <td className="max-w-xs truncate px-6 py-5">
                    {order.link}
                  </td>

                  <td className="px-6 py-5">
                    {order.quantity}
                  </td>

                  <td className="px-6 py-5">
                    £{Number(order.charge).toFixed(2)}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        order.status === "Completed"
                          ? "bg-green-600"
                          : order.status === "Pending"
                          ? "bg-yellow-600"
                          : order.status === "Processing"
                          ? "bg-blue-600"
                          : order.status === "Cancelled"
                          ? "bg-red-600"
                          : "bg-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="px-6 py-5">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-700"
                      >
                        View
                      </Link>

                      <CompleteOrderButton
                        orderId={order.id}
                      />

                      <DeleteOrderButton
                        orderId={order.id}
                      />

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={9}
                  className="py-12 text-center text-slate-400"
                >
                  No orders found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}