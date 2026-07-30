export default function Features() {
  const features = [
    {
      title: "⚡ Instant Delivery",
      description:
        "Orders start within minutes with our high-speed automated system.",
    },
    {
      title: "🔒 Secure Payments",
      description:
        "Safe checkout with trusted payment gateways and encrypted security.",
    },
    {
      title: "🌍 20+ Platforms",
      description:
        "Instagram, TikTok, YouTube, Facebook, Telegram, Spotify, X, Twitch, LinkedIn and more.",
    },
    {
      title: "📈 Real Growth",
      description:
        "Designed to help creators, influencers and businesses grow faster.",
    },
    {
      title: "💬 24/7 Support",
      description:
        "Our support team is always available whenever you need help.",
    },
    {
      title: "🏆 Premium Quality",
      description:
        "Reliable services trusted by thousands of satisfied customers.",
    },
  ];

  return (
    <section className="bg-slate-900 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-white">
          Why Choose Us
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-3xl mx-auto">
          Everything you need to grow your social media presence in one powerful platform.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 hover:bg-slate-700 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-blue-500">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-300 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}