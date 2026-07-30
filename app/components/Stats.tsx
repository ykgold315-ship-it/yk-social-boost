export default function Stats() {
  const stats = [
    ["500K+", "Orders Delivered"],
    ["180+", "Countries Served"],
    ["15K+", "Happy Customers"],
    ["24/7", "Support"],
  ];

  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">

        {stats.map(([number, title]) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-10 text-center hover:-translate-y-2 hover:border-blue-500 transition-all"
          >
            <h2 className="text-5xl font-black text-blue-400">
              {number}
            </h2>

            <p className="mt-4 text-gray-400">
              {title}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}