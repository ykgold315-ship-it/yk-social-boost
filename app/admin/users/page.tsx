import Link from "next/link";
import { createClient } from "@/lib/server-client";

export default async function AdminUsersPage() {

  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Users
        </h1>

        <p className="mt-2 text-slate-400">
          Manage all customer accounts.
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

              <th className="px-6 py-4 text-left">
                Role
              </th>

              <th className="px-6 py-4 text-left">
                Created
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users?.map((user) => (

              <tr
                key={user.id}
                className="border-t border-slate-800 hover:bg-slate-800"
              >

                <td className="px-6 py-5">
                  {user.full_name}
                </td>

                <td className="px-6 py-5">
                  {user.email}
                </td>

                <td className="px-6 py-5">
                  £{Number(user.balance).toFixed(2)}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      user.role === "admin"
                        ? "bg-red-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>

                </td>

                <td className="px-6 py-5">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 text-center">

                  <Link
                    href={`/admin/users/${user.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2"
                  >
                    View
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}