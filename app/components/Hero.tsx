export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-32 px-8">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[150px]" />

      <div className="max-w-6xl mx-auto text-center relative">

        <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
          🚀 Trusted Social Media Growth Platform
        </span>

        <h1 className="mt-8 text-6xl md:text-8xl font-black leading-tight">
          Grow Faster
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-white bg-clip-text text-transparent">
            With YK Social Boost
          </span>
        </h1>

        <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
          Premium SMM Panel helping creators, influencers, agencies and
          businesses grow across Instagram, TikTok, YouTube, Facebook,
          Telegram and more.
        </p>

        <div className="mt-12 flex justify-center gap-6 flex-wrap">

          <button className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 font-bold hover:scale-105 transition">
            Get Started
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 hover:bg-slate-900 transition">
            View Services
          </button>

        </div>

      </div>

    </section>
  );
}