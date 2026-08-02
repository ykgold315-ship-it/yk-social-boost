"use client";

import Link from "next/link";

export default function AddFundsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-10">
        Add Funds
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Stripe */}

        <Link
          href="/dashboard/add-funds/stripe"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition"
        >
          <div className="text-5xl mb-5">💳</div>

          <h2 className="text-2xl font-bold">
            Credit / Debit Card
          </h2>

          <p className="mt-4 text-slate-400">
            Pay securely with Visa, Mastercard, Apple Pay and Google Pay.
          </p>
        </Link>

        {/* Bank */}

        <Link
          href="/dashboard/add-funds/bank"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-500 transition"
        >
          <div className="text-5xl mb-5">🏦</div>

          <h2 className="text-2xl font-bold">
            Bank Transfer
          </h2>

          <p className="mt-4 text-slate-400">
            Transfer directly into our bank account.
          </p>
        </Link>

        {/* Crypto */}

        <Link
          href="/dashboard/add-funds/crypto"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-yellow-500 transition"
        >
          <div className="text-5xl mb-5">₿</div>

          <h2 className="text-2xl font-bold">
            Cryptocurrency
          </h2>

          <p className="mt-4 text-slate-400">
            Pay using BTC, ETH, USDT, USDC and more.
          </p>
        </Link>

      </div>

    </div>
  );
}