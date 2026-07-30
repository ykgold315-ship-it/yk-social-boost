"use client";

import { useState } from "react";
import { supabase } from "@/lib/browser-client";
import { useRouter } from "next/navigation";

export default function WalletActions({
  userId,
  balance,
}: {
  userId: string;
  balance: number;
}) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function updateWallet(add: boolean) {
    if (!amount) return;

    setLoading(true);

    const newBalance = add
      ? balance + Number(amount)
      : balance - Number(amount);

    const { error } = await supabase
      .from("profiles")
      .update({
        balance: newBalance,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Wallet updated successfully.");

    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-28 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
      />

      <button
        disabled={loading}
        onClick={() => updateWallet(true)}
        className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
      >
        +
      </button>

      <button
        disabled={loading}
        onClick={() => updateWallet(false)}
        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
      >
        -
      </button>

    </div>
  );
}