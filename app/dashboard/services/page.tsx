import { getServices } from "@/lib/services";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Services
          </h1>

          <p className="mt-2 text-slate-400">
            Browse all available social media services.
          </p>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full">
          <thead className="border-b border-slate-800 bg-slate-950">
            <tr className="text-left text-slate-400">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Minimum</th>
              <th className="px-6 py-4">Maximum</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service: any) => (
              <tr
                key={service.id}
                className="border-b border-slate-800 hover:bg-slate-800/40"
              >
                <td className="px-6 py-4 text-white">
                  {service.category}
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {service.name}
                </td>

                <td className="px-6 py-4 text-green-400">
                  ${service.price}
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {service.min_order}
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {service.max_order}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}