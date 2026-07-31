import { createClient } from "@/lib/server-client";

export default async function ServiceMapperPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id,name")
    .order("id");

  const { data: providerServices } = await supabase
    .from("provider_services")
    .select("*")
    .order("provider_id");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Service Mapper</h1>
        <p className="text-slate-400 mt-2">
          Connect every local service to a provider service.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-800">
            <tr>
              <th className="px-5 py-4 text-left">Local Service</th>
              <th className="px-5 py-4 text-left">Provider Service</th>
              <th className="px-5 py-4 text-left">Platform</th>
            </tr>
          </thead>

          <tbody>
            {providerServices?.map((item) => (
              <tr key={item.id} className="border-b border-slate-800">
                <td className="px-5 py-4">
                  {services?.find(
                    (s) => s.id === item.service_id
                  )?.name ?? "Not Connected"}
                </td>

                <td className="px-5 py-4">
                  {item.provider_service_id}
                </td>

                <td className="px-5 py-4">
                  {item.platform}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}