export default function Testimonials() {
  const reviews = [
    {
      name: "James Carter",
      role: "Digital Agency Owner",
      review:
        "YK Social Boost has completely transformed our business. Orders are fast, reliable, and our clients love the results.",
    },
    {
      name: "Sophia Williams",
      role: "Content Creator",
      review:
        "I've tried many SMM providers, but none matched the quality and speed of YK Social Boost. Highly recommended!",
    },
    {
      name: "Michael Johnson",
      role: "Marketing Consultant",
      review:
        "The reseller panel is outstanding. Easy to use, excellent pricing, and great customer support.",
    },
  ];

  return (
    <section className="py-28 px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <span className="text-blue-400 uppercase tracking-[0.3em] font-semibold">
            Testimonials
          </span>

          <h2 className="text-5xl font-black mt-4">
            Trusted by Thousands
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Businesses, creators, and agencies around the world rely on YK Social Boost.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-yellow-400 text-xl mb-4">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-gray-300 leading-8">
                "{review.review}"
              </p>

              <div className="mt-8">
                <h3 className="font-bold text-xl">
                  {review.name}
                </h3>

                <p className="text-gray-500">
                  {review.role}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}