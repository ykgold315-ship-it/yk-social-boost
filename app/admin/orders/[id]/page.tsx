import { notFound } from "next/navigation";
import { createClient } from "@/lib/server-client";
import OrderActions from "@/app/components/admin/OrderActions";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: order } = await supabase
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
    `)
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Order #{order.id}
        </h1>

        <p className="mt-2 text-slate-400">
          View and manage this customer order.
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Customer Information
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-slate-400">Name</p>
              <p className="font-semibold">
                {order.profiles?.full_name}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-semibold">
                {order.profiles?.email}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Order Information
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-slate-400">Service</p>
              <p className="font-semibold">
                {order.services?.name}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Link</p>
              <p className="break-all font-semibold">
                {order.link}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Quantity</p>
              <p>{order.quantity}</p>
            </div>

            <div>
              <p className="text-slate-400">Charge</p>
              <p>£{Number(order.charge).toFixed(2)}</p>
            </div>

            <div>
              <p className="text-slate-400">Status</p>

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

            </div>

            <div>
              <p className="text-slate-400">Start Count</p>
              <p>{order.start_count ?? 0}</p>
            </div>

            <div>
              <p className="text-slate-400">Remains</p>
              <p>{order.remains ?? 0}</p>
            </div>

            <div>
              <p className="text-slate-400">Provider Order ID</p>
              <p>{order.provider_order_id ?? "-"}</p>
            </div>

            <div>
              <p className="text-slate-400">Created</p>
              <p>
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

          </div>

        </div>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="mb-8 text-2xl font-bold">
          Admin Actions
        </h2>

       <OrderActions orderId={order.id} />

      </div>

    </div>
  );
}