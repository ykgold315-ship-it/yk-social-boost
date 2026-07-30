import { createClient } from "@/lib/server-client";
import Link from "next/link";

export default async function NewProviderServicePage() {
  const supabase = await createClient();

  const { data: providers } = await supabase
    .from("providers")
    .select("*")
    .order("name");

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("name");

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        New Provider Mapping
      </h1>

      <form
        action="/api/admin/provider-services"
        method="POST"
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >

        <div>
          <label className="block mb-2">
            Provider
          </label>

          <select
            name="provider_id"
            className="w-full rounded-lg bg-slate-800 p-3"
          >
            {providers?.map((provider) => (
              <option
                key={provider.id}
                value={provider.id}
              >
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Your Service
          </label>

          <select
            name="service_id"
            className="w-full rounded-lg bg-slate-800 p-3"
          >
            {services?.map((service) => (
              <option
                key={service.id}
                value={service.id}
              >
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Provider Service ID
          </label>

          <input
            name="provider_service_id"
            className="w-full rounded-lg bg-slate-800 p-3"
            placeholder="Example: 12345"
          />
        </div>

        <div>
          <label className="block mb-2">
            Provider Rate
          </label>

          <input
            name="provider_rate"
            type="number"
            step="0.0001"
            className="w-full rounded-lg bg-slate-800 p-3"
          />
        </div>

        <button
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold"
        >
          Save Mapping
        </button>

      </form>

      <Link
        href="/admin/provider-services"
        className="inline-block mt-6 text-blue-400"
      >
        ← Back
      </Link>

    </div>
  );
}