import { createClient } from "@/lib/server-client";

export default async function CustomerCredits({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: credits } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", params.id)
    .single();

  return (
    <div className="max-w-3xl">

      <h1 className="text-4xl font-bold mb-8">
        Credit Manager
      </h1>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">

        <div className="space-y-4">

          <div>
            <p className="text-slate-400">
              Customer
            </p>

            <h2 className="text-2xl font-bold">
              {profile?.full_name}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">
              Current Credits
            </p>

            <h2 className="text-4xl font-bold text-green-500">
              {credits?.credits ?? 0}
            </h2>
          </div>

        </div>

        <form
          action={`/api/admin/customers/${params.id}/credits`}
          method="POST"
          className="mt-10 space-y-5"
        >

          <input
            type="number"
            name="credits"
            placeholder="Credits"
            className="w-full rounded-xl bg-slate-800 p-4"
          />

          <select
            name="action"
            className="w-full rounded-xl bg-slate-800 p-4"
          >
            <option value="add">
              Add Credits
            </option>

            <option value="remove">
              Remove Credits
            </option>

          </select>

          <button
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-4 font-bold"
          >
            Save
          </button>

        </form>

      </div>

    </div>
  );
}