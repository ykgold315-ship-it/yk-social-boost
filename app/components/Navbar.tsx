import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white">
            YK
          </div>

          <div>
            <h1 className="text-xl font-bold">YK Social Boost</h1>
            <p className="text-xs text-gray-400">
              Powering Social Media Growth
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-gray-300">

          <Link
            href="/"
            className="hover:text-white transition"
          >
            Home
          </Link>

          <Link
            href="/services"
            className="hover:text-white transition"
          >
            Services
          </Link>

          <Link
            href="/pricing"
            className="hover:text-white transition"
          >
            Pricing
          </Link>

          <Link
            href="/contact"
            className="hover:text-white transition"
          >
            Contact
          </Link>

        </nav>

        {/* CTA */}
        <Link
          href="/register"
          className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-semibold hover:scale-105 transition"
        >
          Get Started
        </Link>

      </div>
    </header>
  );
}