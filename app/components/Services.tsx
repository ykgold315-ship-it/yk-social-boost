export default function Services() {
  const services = [
    {
      icon: "📸",
      title: "Instagram Growth",
      description:
        "Increase followers, likes, views, comments and engagement with premium quality services.",
    },
    {
      icon: "🎵",
      title: "TikTok Growth",
      description:
        "Boost your TikTok profile with real engagement, followers and viral video views.",
    },
    {
      icon: "▶️",
      title: "YouTube Promotion",
      description:
        "Grow your YouTube channel with subscribers, watch time, likes and video views.",
    },
    {
      icon: "💬",
      title: "Telegram Services",
      description:
        "Increase Telegram members, reactions, views and channel engagement.",
    },
    {
      icon: "🎧",
      title: "Spotify Promotion",
      description:
        "Promote your music with streams, playlist followers and monthly listeners.",
    },
    {
      icon: "🌍",
      title: "More Platforms",
      description:
        "Facebook, X, LinkedIn, Twitch, Discord and many more social media services.",
    },
  ];

  return (
    <section className="py-24 px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center">
          Our Services
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-3xl mx-auto">
          Everything you need to grow your online presence from one trusted platform.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {services.map((service, index) => (

            <div
              key={index}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >

              <div className="text-5xl mb-6">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {service.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {service.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}