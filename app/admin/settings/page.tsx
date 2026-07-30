export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your website configuration.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            General Settings
          </h2>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Website Name
              </label>

              <input
                defaultValue="YK Social Boost"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Support Email
              </label>

              <input
                defaultValue="support@yksocialboost.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                WhatsApp Number
              </label>

              <input
                defaultValue="+2348000000000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
              />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Platform Settings
          </h2>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Currency
              </label>

              <input
                defaultValue="GBP (£)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Minimum Deposit
              </label>

              <input
                defaultValue="5"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Minimum Order
              </label>

              <input
                defaultValue="1"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
              />
            </div>

          </div>

        </div>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700">
          Save Settings
        </button>

      </div>

    </div>
  );
}