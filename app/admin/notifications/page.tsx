import { createClient } from "@/lib/server-client";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Notifications
        </h1>

        <p className="mt-2 text-slate-400">
          Every activity happening on your platform.
        </p>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

        <table className="w-full">

          <thead className="border-b border-slate-800">

            <tr>

              <th className="px-6 py-4 text-left">Title</th>

              <th className="px-6 py-4 text-left">Message</th>

              <th className="px-6 py-4 text-left">Type</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {notifications?.map((item) => (

              <tr
                key={item.id}
                className="border-b border-slate-800 hover:bg-slate-800/40"
              >

                <td className="px-6 py-5 font-medium">
                  {item.title}
                </td>

                <td className="px-6 py-5">
                  {item.message}
                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-blue-600 px-3 py-1 text-sm">

                    {item.type}

                  </span>

                </td>

                <td className="px-6 py-5">

                  {item.is_read ? (

                    <span className="rounded-full bg-green-600 px-3 py-1 text-sm">
                      Read
                    </span>

                  ) : (

                    <span className="rounded-full bg-red-600 px-3 py-1 text-sm">
                      Unread
                    </span>

                  )}

                </td>

                <td className="px-6 py-5">
                  {new Date(item.created_at).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}