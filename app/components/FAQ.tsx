export default function FAQ() {
  const faqs = [
    {
      question: "How quickly are orders delivered?",
      answer:
        "Most orders start within minutes after payment. Delivery speed depends on the selected service.",
    },
    {
      question: "Do you support all social media platforms?",
      answer:
        "Yes. We support Instagram, TikTok, YouTube, Facebook, X, Telegram, LinkedIn, Twitch, Spotify and many more.",
    },
    {
      question: "Can I become a reseller?",
      answer:
        "Absolutely. Our reseller program includes API access, wholesale pricing, and unlimited orders.",
    },
    {
      question: "Are payments secure?",
      answer:
        "Yes. All payments are processed through secure payment gateways with industry-standard encryption.",
    },
  ];

  return (
    <section className="py-28 px-8 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <span className="text-blue-400 uppercase tracking-[0.3em] font-semibold">
            FAQ
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Frequently Asked Questions
          </h2>

          <p className="mt-6 text-gray-400">
            Everything you need to know before placing your first order.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 transition"
            >
              <h3 className="text-xl font-bold text-white">
                {faq.question}
              </h3>

              <p className="mt-3 text-gray-400 leading-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}