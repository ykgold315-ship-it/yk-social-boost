"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DepositForm() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [loading, setLoading] = useState(false);

  async function submitDeposit() {
    if (!amount) {
      return alert("Enter amount.");
    }

    setLoading(true);

    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        payment_method: method,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      return alert(data.error);
    }

    alert("Deposit request submitted successfully.");

    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

      <input
        type="number"
        placeholder="Amount (£)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
      >
        <option>Bank Transfer</option>
        <option>Paystack</option>
        <option>Stripe</option>
        <option>Crypto</option>
      </select>

      <button
        onClick={submitDeposit}
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Continue Payment"}
      </button>

    </div>
  );
}