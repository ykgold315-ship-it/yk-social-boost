"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";

type Wallet = {
  id: string;
  coin: string;
  network: string;
  wallet_address: string;
  qr_code: string;
  active: boolean;
};

export default function CryptoWalletsPage() {
  const supabase = createClient();

  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [form, setForm] = useState({
    coin: "",
    network: "",
    wallet_address: "",
    qr_code: "",
  });

  useEffect(() => {
    loadWallets();
  }, []);

  async function loadWallets() {
    const { data } = await supabase
      .from("crypto_wallets")
      .select("*")
      .order("created_at", { ascending: false });

    setWallets((data ?? []) as Wallet[]);
  }

  async function saveWallet() {
    const { error } = await supabase
      .from("crypto_wallets")
      .insert([
        {
          coin: form.coin,
          network: form.network,
          wallet_address: form.wallet_address,
          qr_code: form.qr_code,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Wallet Saved");

    setForm({
      coin: "",
      network: "",
      wallet_address: "",
      qr_code: "",
    });

    loadWallets();
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Crypto Wallet Manager
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">

        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
          placeholder="Coin (BTC, ETH, USDT...)"
          value={form.coin}
          onChange={(e)=>setForm({...form,coin:e.target.value})}
        />

        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
          placeholder="Network (TRC20 / ERC20 / BEP20)"
          value={form.network}
          onChange={(e)=>setForm({...form,network:e.target.value})}
        />

        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
          rows={3}
          placeholder="Wallet Address"
          value={form.wallet_address}
          onChange={(e)=>setForm({...form,wallet_address:e.target.value})}
        />

        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
          placeholder="QR Image URL (optional)"
          value={form.qr_code}
          onChange={(e)=>setForm({...form,qr_code:e.target.value})}
        />

        <button
          onClick={saveWallet}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl"
        >
          Save Wallet
        </button>

      </div>

      <div className="mt-10 space-y-5">

        {wallets.map((wallet)=>(
          <div
            key={wallet.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >

            <h2 className="text-2xl font-bold">
              {wallet.coin}
            </h2>

            <p className="text-slate-400">
              {wallet.network}
            </p>

            <div className="mt-4 break-all">
              {wallet.wallet_address}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}