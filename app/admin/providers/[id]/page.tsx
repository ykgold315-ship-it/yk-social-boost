import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/server-client";
import ImportServicesButton from "@/app/components/admin/ImportServicesButton";

export default async function ProviderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .single();

  if (!provider) {
    notFound();
  }

  const { count: totalServices } = await supabase
    .from("provider_services")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("provider_id", id);

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          {provider.name}
        </h1>

        <p className="mt-2 text-slate-400">
          Provider Management Center
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Status</p>

          <h2 className="mt-2 text-2xl font-bold">
            {provider.status}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Balance</p>

          <h2 className="mt-2 text-2xl font-bold">
            £{provider.balance ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Priority</p>

          <h2 className="mt-2 text-2xl font-bold">
            {provider.priority}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Services</p>

          <h2 className="mt-2 text-2xl font-bold">
            {totalServices ?? 0}
          </h2>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">

          <h2 className="text-xl font-bold">
            Provider Actions
          </h2>

          <ImportServicesButton
            providerId={provider.id}
          />

          <Link
            href={`/admin/provider-services?provider=${provider.id}`}
            className="block rounded-xl bg-slate-800 px-5 py-3 hover:bg-slate-700"
          >
            View Imported Services
          </Link>

          <Link
            href={`/admin/service-mapper`}
            className="block rounded-xl bg-slate-800 px-5 py-3 hover:bg-slate-700"
          >
            Open Service Mapper
          </Link>

          <button
            className="w-full rounded-xl bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            Sync Prices
          </button>

          <button
            className="w-full rounded-xl bg-green-600 px-5 py-3 hover:bg-green-700"
          >
            Refresh Balance
          </button>

          <button
            className="w-full rounded-xl bg-yellow-600 px-5 py-3 hover:bg-yellow-700"
          >
            Test API Connection
          </button>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">

          <h2 className="text-xl font-bold">
            Configuration
          </h2>

          <div>
            <p className="text-slate-400 text-sm">
              API URL
            </p>

            <p className="break-all">
              {provider.api_url}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Currency
            </p>

            <p>
              {provider.currency ?? "GBP"}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Rate Multiplier
            </p>

            <p>
              {provider.rate_multiplier ?? 1}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}