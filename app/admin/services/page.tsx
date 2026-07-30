import { createClient } from "@/lib/server-client";
import ServiceTable from "../../components/admin/ServiceTable";

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  const { count: active } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  const { count: inactive } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("active", false);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Service Management
        </h1>

        <p className="mt-2 text-slate-400">
          Manage all SMM services from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Total Services</p>

          <h2 className="text-4xl font-bold mt-2">
            {total ?? 0}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Active Services</p>

          <h2 className="text-4xl font-bold text-green-400 mt-2">
            {active ?? 0}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Inactive Services</p>

          <h2 className="text-4xl font-bold text-red-400 mt-2">
            {inactive ?? 0}
          </h2>
        </div>

      </div>

      <ServiceTable />

    </div>
  );
}