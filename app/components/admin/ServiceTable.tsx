import DeleteServiceButton from "./DeleteServiceButton";
import Link from "next/link";
import { createClient } from "@/lib/server-client";

export default async function ServiceTable() {
  const supabase = await createClient();

 const { data: services } = await supabase
  .from("services")
  .select(`
    *,
    categories (
      id,
      name
    )
  `)
  .order("id", { ascending: false });

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-slate-800">

        <div className="flex gap-3">

          <input
            placeholder="Search service..."
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 w-64"
          />

          <select className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
            <option>All Categories</option>
          </select>

          <select className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <Link
          href="/admin/services/new"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold"
        >
          + Add Service
        </Link>

      </div>

      <table className="w-full">

        <thead className="bg-slate-950 text-slate-400">

          <tr>

            <th className="px-6 py-4 text-left">ID</th>

            <th className="px-6 py-4 text-left">Category</th>

            <th className="px-6 py-4 text-left">Service</th>

            <th className="px-6 py-4 text-left">Price</th>

            <th className="px-6 py-4 text-left">Profit</th>

            <th className="px-6 py-4 text-left">Provider</th>

            <th className="px-6 py-4 text-left">Status</th>

            <th className="px-6 py-4 text-right">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {services?.map((service) => (

            <tr
              key={service.id}
              className="border-t border-slate-800 hover:bg-slate-800"
            >

              <td className="px-6 py-5">
                #{service.id}
              </td>

              <td className="px-6 py-5">
               {service.categories?.name ?? "No Category"}
              </td>

              <td className="px-6 py-5">

                <div className="font-semibold">
                  {service.name}
                </div>

                <div className="text-sm text-slate-400">
                  {service.description}
                </div>

              </td>

              <td className="px-6 py-5">
                ₦{service.price}
              </td>

              <td className="px-6 py-5 text-green-400">
                ₦{service.profit ?? 0}
              </td>

              <td className="px-6 py-5">
                {service.provider || "Manual"}
              </td>

              <td className="px-6 py-5">

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    service.active
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {service.active ? "Active" : "Inactive"}
                </span>

              </td>

              <td className="px-6 py-5">

               <div className="flex justify-end gap-2">

  <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg">
    Duplicate
  </button>

  <Link
    href={`/admin/services/edit/${service.id}`}
    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg"
  >
    Edit
  </Link>

  <DeleteServiceButton id={service.id} />

</div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}