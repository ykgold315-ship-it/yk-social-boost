import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto py-24 px-6">

        <h1 className="text-5xl font-bold mb-8">
          Our Services
        </h1>

        <p className="text-slate-300 mb-10">
          Premium Social Media Marketing services for every platform.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            "Instagram Followers",
            "Instagram Likes",
            "TikTok Followers",
            "TikTok Likes",
            "YouTube Views",
            "YouTube Subscribers",
            "Facebook Followers",
            "Telegram Members",
          ].map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="font-bold text-xl">{service}</h2>
            </div>
          ))}

        </div>

        <Link
          href="/register"
          className="inline-block mt-10 bg-blue-600 px-8 py-4 rounded-xl"
        >
          Start Now
        </Link>

      </div>
    </main>
  );
}