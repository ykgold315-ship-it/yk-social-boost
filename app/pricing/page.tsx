import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto py-24 px-6">

        <h1 className="text-5xl font-bold mb-8">
          Pricing
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "Starter",
            "Professional",
            "Agency",
          ].map((plan) => (
            <div
              key={plan}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-8"
            >
              <h2 className="text-2xl font-bold">{plan}</h2>

              <p className="text-slate-400 mt-4">
                Affordable social media growth.
              </p>

              <button className="mt-8 w-full rounded-xl bg-blue-600 py-3">
                Choose Plan
              </button>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}