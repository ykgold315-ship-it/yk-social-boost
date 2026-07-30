import { createClient } from "@/lib/server-client";

export default async function AutomationPage() {
  const supabase = await createClient();

  const { count: queued } = await supabase
    .from("automation_jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "Queued");

  const { count: processing } = await supabase
    .from("automation_jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "Processing");

  const { count: completed } = await supabase
    .from("automation_jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");

  const { count: failed } = await supabase
    .from("automation_jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "Failed");

  const { data: jobs } = await supabase
    .from("automation_jobs")
    .select(`
      *,
      orders(
        id,
        link,
        quantity,
        status
      )
    `)
    .order("id", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Automation Engine
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor every automation job running on your platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Queued</p>
          <h2 className="mt-2 text-4xl font-bold text-yellow-400">
            {queued ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Processing</p>
          <h2 className="mt-2 text-4xl font-bold text-blue-400">
            {processing ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Completed</p>
          <h2 className="mt-2 text-4xl font-bold text-green-400">
            {completed ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">Failed</p>
          <h2 className="mt-2 text-4xl font-bold text-red-400">
            {failed ?? 0}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Automation Queue
          </h2>

          <p className="text-slate-400">
            Every job created by customer orders.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">Job</th>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>

            <tbody>
              {jobs?.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-slate-800"
                >
                  <td className="px-4 py-4">
                    #{job.id}
                  </td>

                  <td className="px-4 py-4">
                    #{job.order_id}
                  </td>

                  <td className="px-4 py-4">
                    <div className="w-48">
                      <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-3 rounded-full bg-green-500 transition-all duration-500"
                          style={{
                            width: `${job.progress}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        {job.progress}%
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        job.status === "Completed"
                          ? "bg-green-600"
                          : job.status === "Processing"
                          ? "bg-blue-600"
                          : job.status === "Queued"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {new Date(job.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}