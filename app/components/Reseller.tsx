export default function Reseller() {
  return (
    <section className="py-28 px-8 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
            👑 Reseller Program
          </span>

          <h2 className="mt-6 text-5xl font-black leading-tight">
            Build Your Own
            <span className="block text-blue-400">
              SMM Business
            </span>
          </h2>

          <p className="mt-8 text-gray-400 text-lg leading-8">
            Start your own Social Media Marketing business with our
            wholesale reseller platform. Sell thousands of services
            under your own brand while we handle the delivery.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <span className="text-2xl">⚡</span>
              <p>Instant order processing</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl">🌍</span>
              <p>Worldwide service coverage</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl">🔗</span>
              <p>Free API Integration</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl">💰</span>
              <p>Wholesale reseller pricing</p>
            </div>

          </div>

          <button className="mt-12 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 font-bold hover:scale-105 transition">
            Become a Reseller
          </button>

        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-10">

          <h3 className="text-3xl font-bold mb-8">
            Why Resellers Choose Us
          </h3>

          <div className="space-y-6">

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span>API Access</span>
              <span className="text-green-400">Included</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span>Unlimited Orders</span>
              <span className="text-green-400">Yes</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span>24/7 Support</span>
              <span className="text-green-400">Available</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span>Fast Delivery</span>
              <span className="text-green-400">Guaranteed</span>
            </div>

            <div className="flex justify-between">
              <span>White Label Ready</span>
              <span className="text-green-400">Yes</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}