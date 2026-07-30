export default function NewProviderPage() {
  return (

    <div className="max-w-3xl">

      <h1 className="text-4xl font-bold mb-8">
        Add Provider
      </h1>

      <form
        action="/api/admin/providers"
        method="POST"
        className="space-y-6"
      >

        <input
          name="name"
          placeholder="Provider Name"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4"
        />

        <input
          name="api_url"
          placeholder="API URL"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4"
        />

        <input
          name="api_key"
          placeholder="API Key"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4"
        />

        <input
          name="priority"
          type="number"
          defaultValue={1}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4"
        />

        <button
          className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-700"
        >
          Save Provider
        </button>

      </form>

    </div>

  );
}