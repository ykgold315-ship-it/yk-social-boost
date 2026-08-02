"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DepositForm() {
  const router = useRouter();

  const [credits, setCredits] = useState("");
  const [method, setMethod] = useState("");

  async function createDeposit() {
    if (!credits || !method) {
      alert("Complete all fields");
      return;
    }

    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(credits),
        payment_method: method,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    if (method === "Stripe") {
      router.push("/dashboard/add-funds/stripe");
      return;
    }

    if (method === "Bank Transfer") {
      router.push("/dashboard/add-funds/bank");
      return;
    }

    if (method === "Crypto") {
      router.push("/dashboard/add-funds/crypto");
      return;
    }
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Buy Credits
      </h2>

      <input
        type="number"
        placeholder="Credits"
        value={credits}
        onChange={(e) => setCredits(e.target.value)}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-4 mb-5"
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-4 mb-6"
      >
        <option value="">Choose Payment Method</option>
        <option>Stripe</option>
        <option>Bank Transfer</option>
        <option>Crypto</option>
      </select>

      <button
        onClick={createDeposit}
        className="w-full rounded-xl bg-blue-600 py-4 font-bold hover:bg-blue-700"
      >
        Continue
      </button>

    </div>
  );
}