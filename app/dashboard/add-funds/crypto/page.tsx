"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";

type Wallet = {
  id: string;
  coin: string;
  network: string;
  wallet_address: string;
  qr_code: string;
};

export default function CryptoPage() {
  const supabase = createClient();

  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    loadWallets();
  }, []);

  async function loadWallets() {
    const { data } = await supabase
      .from("crypto_wallets")
      .select("*")
      .eq("active", true);

    setWallets((data ?? []) as Wallet[]);
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Cryptocurrency Deposit
      </h1>

      <div className="space-y-6">

        {wallets.map((wallet) => (

          <div
            key={wallet.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >

            <h2 className="text-2xl font-bold">
              {wallet.coin}
            </h2>

            <p className="text-slate-400 mb-5">
              {wallet.network}
            </p>

            <div className="bg-slate-800 rounded-xl p-4 break-all">
              {wallet.wallet_address}
            </div>

            {wallet.qr_code && (

              <img
                src={wallet.qr_code}
                alt="QR"
                className="mt-6 w-52 rounded-xl border border-slate-700"
              />

            )}

          </div>

        ))}

      </div>

    </div>
  );
}