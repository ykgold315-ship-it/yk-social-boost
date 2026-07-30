export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      description: "Perfect for individuals getting started.",
      features: [
        "100 Orders / Month",
        "Basic Dashboard",
        "Email Support",
        "Instant Delivery",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$49",
      description: "Best choice for agencies and growing businesses.",
      features: [
        "Unlimited Orders",
        "Advanced Dashboard",
        "Priority Support",
        "API Access",
        "Fast Delivery",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large teams and reseller businesses.",
      features: [
        "Everything in Professional",
        "White Label",
        "Dedicated Support",
        "Custom Integrations",
        "Highest Priority",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-28 px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <span className="text-blue-400 uppercase tracking-[0.3em] font-semibold">
            Pricing
          </span>

          <h2 className="text-5xl font-black mt-4">
            Choose Your Plan
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Flexible pricing for creators, businesses, and resellers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-blue-500 bg-slate-950 shadow-lg shadow-blue-500/20"
                  : "border-slate-800 bg-slate-950"
              }`}
            >
              {plan.popular && (
                <div className="mb-6 inline-block rounded-full bg-blue-500 px-4 py-1 text-sm font-bold">
                  Most Popular
                </div>
              )}

              <h3 className="text-3xl font-bold">{plan.name}</h3>

              <div className="mt-4 text-5xl font-black">
                {plan.price}
                <span className="text-lg text-gray-400">/mo</span>
              </div>

              <p className="mt-4 text-gray-400">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <button className="mt-10 w-full rounded-xl bg-blue-600 py-3 font-bold hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}