export default function Contact() {
  return (
    <section className="py-28 px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">

        <span className="text-blue-400 uppercase tracking-[0.3em] font-semibold">
          Contact
        </span>

        <h2 className="mt-4 text-5xl font-black">
          Let's Grow Together
        </h2>

        <p className="mt-6 text-gray-400 text-lg">
          Have questions or need a custom solution? Our team is ready to help
          you 24/7.
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-8">

          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-8">
            <h3 className="text-xl font-bold text-blue-400">
              Email
            </h3>

            <p className="mt-4 text-gray-400">
              support@yksocialboost.com
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-8">
            <h3 className="text-xl font-bold text-blue-400">
              Live Chat
            </h3>

            <p className="mt-4 text-gray-400">
              Available 24 Hours
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-8">
            <h3 className="text-xl font-bold text-blue-400">
              Response Time
            </h3>

            <p className="mt-4 text-gray-400">
              Usually under 10 minutes
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}