export default function Platforms() {
  const platforms = [
    { name: "Instagram", icon: "📸" },
    { name: "TikTok", icon: "🎵" },
    { name: "YouTube", icon: "▶️" },
    { name: "Facebook", icon: "📘" },
    { name: "Telegram", icon: "✈️" },
    { name: "Spotify", icon: "🎧" },
    { name: "X", icon: "❌" },
    { name: "LinkedIn", icon: "💼" },
    { name: "Discord", icon: "💬" },
    { name: "Twitch", icon: "🎮" },
  ];

  return (
    <section className="py-28 px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">

        <div className="text-center">

          <span className="text-blue-400 font-semibold uppercase tracking-widest">
            Platforms
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Grow On Every Platform
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            From creators to businesses, we provide high-quality growth
            services across the world's biggest social media platforms.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-16">

          {platforms.map((platform) => (

            <div
              key={platform.name}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 text-center hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >

              <div className="text-5xl">
                {platform.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {platform.name}
              </h3>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}