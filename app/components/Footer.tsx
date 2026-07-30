export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">

        <div>
          <h2 className="text-2xl font-black text-blue-400">
            YK Social Boost
          </h2>

          <p className="text-gray-500 mt-2">
            Premium Social Media Growth Platform
          </p>
        </div>

        <div className="flex gap-8 mt-6 md:mt-0 text-gray-400">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>

      </div>

      <p className="text-center text-gray-600 mt-10">
        © 2026 YK Social Boost. All rights reserved.
      </p>
    </footer>
  );
}