export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto py-24 px-6">

        <h1 className="text-5xl font-bold mb-8">
          Contact Us
        </h1>

        <form className="space-y-6">

          <input
            className="w-full rounded-xl bg-slate-900 border border-slate-700 p-4"
            placeholder="Your Name"
          />

          <input
            className="w-full rounded-xl bg-slate-900 border border-slate-700 p-4"
            placeholder="Email Address"
          />

          <textarea
            rows={6}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 p-4"
            placeholder="Message"
          />

          <button
            className="rounded-xl bg-blue-600 px-8 py-4"
          >
            Send Message
          </button>

        </form>

      </div>
    </main>
  );
}