import Link from "next/link";
import { createClient } from "@/lib/server-client";

export default async function SupportPage() {
  const supabase = await createClient();

  const { data: tickets, error } = await supabase
  .from("tickets")
  .select("*")
  .order("created_at", { ascending: false });

console.log("Tickets:", tickets);
console.log("Tickets Error:", error);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name");

  const getUserName = (userId: string) => {
    return (
      profiles?.find((user) => user.id === userId)?.full_name ??
      "Unknown User"
    );
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Support Tickets
        </h1>

        <p className="mt-2 text-slate-400">
          Manage customer support requests.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <table className="w-full">

          <thead className="bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {tickets && tickets.length > 0 ? (

              tickets.map((ticket) => (

                <tr
                  key={ticket.id}
                  className="border-t border-slate-800"
                >

                  <td className="px-6 py-4">
                    #{ticket.id}
                  </td>

                  <td className="px-6 py-4">
                    {getUserName(ticket.user_id)}
                  </td>

                  <td className="px-6 py-4">
                    {ticket.subject}
                  </td>

                  <td className="px-6 py-4">

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm">
                      {ticket.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <Link
                      href={`/admin/support/${ticket.id}`}
                      className="rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-700"
                    >
                      Open
                    </Link>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400"
                >
                  No support tickets yet.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}