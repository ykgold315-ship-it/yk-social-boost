import { createClient } from "@/lib/server-client";

export default async function ProviderServicesPage() {
  const supabase = await createClient();

  const { data: mappings } = await supabase
    .from("provider_services")
    .select("*")
    .order("platform", { ascending: true });

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Imported Provider Services
        </h1>

        <p className="mt-2 text-slate-400">
          All services imported from JustAnotherPanel.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-4 text-left">Provider ID</th>

              <th className="p-4 text-left">Category</th>

              <th className="p-4 text-left">Service</th>

              <th className="p-4 text-left">Rate</th>

              <th className="p-4 text-left">Min</th>

              <th className="p-4 text-left">Max</th>

            </tr>

          </thead>

          <tbody>

            {mappings?.map((service) => (

              <tr
                key={service.id}
                className="border-t border-slate-800"
              >

                <td className="p-4">
                  {service.provider_service_id}
                </td>

                <td className="p-4">
                  {service.platform}
                </td>

                <td className="p-4">
                  {service.service_name}
                </td>

                <td className="p-4">
                  £{Number(service.rate).toFixed(4)}
                </td>

                <td className="p-4">
                  {service.min}
                </td>

                <td className="p-4">
                  {service.max}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}