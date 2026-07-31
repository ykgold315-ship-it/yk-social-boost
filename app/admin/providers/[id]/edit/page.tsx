import { notFound } from "next/navigation";
import { createClient } from "@/lib/server-client";

export default async function EditProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .single();

  if (!provider) {
    notFound();
  }

  return (
    <div className="max-w-4xl">

      <h1 className="mb-8 text-4xl font-bold">
        Edit Provider
      </h1>

      <form
        action="/api/admin/providers/update"
        method="POST"
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >

        <input
          type="hidden"
          name="id"
          defaultValue={provider.id}
        />

        <div>

          <label className="mb-2 block text-sm">
            Provider Name
          </label>

          <input
            name="name"
            defaultValue={provider.name}
            className="w-full rounded-xl bg-slate-800 p-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm">
            API URL
          </label>

          <input
            name="api_url"
            defaultValue={provider.api_url}
            className="w-full rounded-xl bg-slate-800 p-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm">
            API Key
          </label>

          <input
            name="api_key"
            defaultValue={provider.api_key}
            className="w-full rounded-xl bg-slate-800 p-3"
          />

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="mb-2 block text-sm">
              Priority
            </label>

            <input
              type="number"
              name="priority"
              defaultValue={provider.priority}
              className="w-full rounded-xl bg-slate-800 p-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm">
              Status
            </label>

            <select
              name="status"
              defaultValue={provider.status}
              className="w-full rounded-xl bg-slate-800 p-3"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>

        </div>

        <button
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>

      </form>

    </div>
  );
}