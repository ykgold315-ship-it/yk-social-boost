"use client";

import { useState } from "react";
import { supabase } from "../../lib/browser-client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

alert("🎉 Account created successfully! Please check your email to verify your account.");

window.location.href = "/login";  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-10">

        <h1 className="text-4xl font-bold text-center text-white">
          Create Account
        </h1>

        <p className="text-center text-gray-400 mt-3">
          Join YK Social Boost
        </p>

        <form onSubmit={handleRegister} className="space-y-5 mt-8">

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>
      </div>
    </main>
  );
}