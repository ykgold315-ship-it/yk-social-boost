import { createClient } from "@/lib/server-client";
import WalletActions from "@/app/components/admin/WalletActions";

export default async function WalletPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, balance")
    .order("full_name");

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Wallet Management
        </h1>

        <p className="mt-2 text-slate-400">
          Manage customer wallet balances.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <table className="w-full">

          <thead className="bg-slate-950">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-left">
                Balance
              </th>

              <th className="px-6 py-4 text-center">
                Wallet Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users?.map((user) => (

              <tr
                key={user.id}
                className="border-t border-slate-800"
              >

                <td className="px-6 py-4">
                  {user.full_name}
                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4 font-bold text-green-400">
                  £{Number(user.balance ?? 0).toFixed(2)}
                </td>

                <td className="px-6 py-4 text-center">

                  <WalletActions
                    userId={user.id}
                    balance={Number(user.balance ?? 0)}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}