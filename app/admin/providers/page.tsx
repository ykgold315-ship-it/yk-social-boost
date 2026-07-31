import Link from "next/link";
import { createClient } from "@/lib/server-client";
import ImportServicesButton from "@/app/components/admin/ImportServicesButton";

export default async function ProvidersPage() {
  const supabase = await createClient();

  const { data: providers } = await supabase
    .from("providers")
    .select("*")
    .order("priority", { ascending: true });

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Providers
          </h1>

          <p className="mt-2 text-slate-400">
            Manage every SMM Provider connected to your platform.
          </p>
        </div>

        <Link
          href="/admin/providers/new"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          Add Provider
        </Link>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <table className="w-full">

          <thead className="border-b border-slate-800">

            <tr>

              <th className="px-6 py-4 text-left">Name</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Priority</th>

              <th className="px-6 py-4 text-left">Balance</th>

              <th className="px-6 py-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {providers?.map((provider) => (

              <tr
                key={provider.id}
                className="border-b border-slate-800"
              >

                <td className="px-6 py-5 font-medium">
                  {provider.name}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      provider.status === "Active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {provider.status}
                  </span>

                </td>

                <td className="px-6 py-5">
                  {provider.priority}
                </td>

                <td className="px-6 py-5">
                  £{provider.balance ?? 0}
                </td>

                <td className="px-6 py-5">

                  <div className="flex flex-wrap gap-2">

                    <Link
                      href={`/admin/providers/${provider.id}`}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
                    >
                      Details
                    </Link>

                    <ImportServicesButton
                      providerId={provider.id}
                    />

                    <Link
                      href={`/admin/providers/${provider.id}/edit`}
                      className="rounded-lg bg-yellow-600 px-3 py-2 text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

            {(!providers || providers.length === 0) && (

              <tr>

                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  No providers found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}