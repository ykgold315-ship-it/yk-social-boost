import { createClient } from "@/lib/server-client";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      role,
      created_at,
      credits (
        credits
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Customers
      </h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Role
              </th>

              <th className="px-6 py-4 text-left">
                Credits
              </th>

              <th className="px-6 py-4 text-left">
                Joined
              </th>

              <th className="px-6 py-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {customers?.map((customer: any) => (

              <tr
                key={customer.id}
                className="border-t border-slate-800"
              >

                <td className="px-6 py-5">
                  {customer.full_name}
                </td>

                <td className="px-6 py-5">
                  {customer.role}
                </td>

                <td className="px-6 py-5">
                  {customer.credits?.credits ?? 0}
                </td>

                <td className="px-6 py-5">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 flex gap-2">

                  <a
                    href={`/admin/customers/${customer.id}`}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    View
                  </a>

                  <a
                    href={`/admin/customers/${customer.id}/credits`}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    Credits
                  </a>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}