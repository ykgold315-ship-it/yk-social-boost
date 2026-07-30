export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up in seconds and access your personal dashboard instantly.",
    },
    {
      number: "02",
      title: "Choose Your Service",
      description:
        "Browse thousands of social media services and select what you need.",
    },
    {
      number: "03",
      title: "Watch Your Growth",
      description:
        "Sit back while we deliver fast, reliable, and high-quality results.",
    },
  ];

  return (
    <section className="py-28 px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">

        <div className="text-center">
          <span className="text-blue-400 uppercase tracking-[0.3em] font-semibold">
            Simple Process
          </span>

          <h2 className="mt-4 text-5xl font-black">
            How It Works
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Getting started takes less than two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-slate-800 bg-slate-950 p-10 hover:border-blue-500 transition-all hover:-translate-y-2"
            >
              <span className="text-6xl font-black text-blue-500">
                {step.number}
              </span>

              <h3 className="mt-8 text-2xl font-bold">
                {step.title}
              </h3>

              <p className="mt-4 text-gray-400 leading-7">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}