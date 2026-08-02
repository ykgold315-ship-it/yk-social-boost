"use client";

import { useState } from "react";
import { createClient } from "@/lib/browser-client";

export default function CryptoSettingsPage() {

  const supabase = createClient();

  const [coin, setCoin] = useState("BTC");
  const [network, setNetwork] = useState("");
  const [wallet, setWallet] = useState("");
  const [uploading, setUploading] = useState(false);

  async function uploadQR(e: any) {

    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("payment-assets")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("payment-assets")
      .getPublicUrl(fileName);

    const qr_code = data.publicUrl;

    const { error: dbError } = await supabase
      .from("crypto_wallets")
      .insert({
        coin,
        network,
        wallet_address: wallet,
        qr_code,
      });

    setUploading(false);

    if (dbError) {
      alert(dbError.message);
      return;
    }

    alert("Wallet Saved Successfully");

    setWallet("");
    setNetwork("");
  }

  return (

    <div className="max-w-5xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Crypto Wallet Settings
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">

        <select
          value={coin}
          onChange={(e)=>setCoin(e.target.value)}
          className="w-full bg-slate-800 p-3 rounded-lg"
        >
          <option>BTC</option>
          <option>ETH</option>
          <option>USDT</option>
          <option>USDC</option>
        </select>

        <input
          className="w-full bg-slate-800 p-3 rounded-lg"
          placeholder="Network"
          value={network}
          onChange={(e)=>setNetwork(e.target.value)}
        />

        <textarea
          className="w-full bg-slate-800 p-3 rounded-lg"
          rows={4}
          placeholder="Wallet Address"
          value={wallet}
          onChange={(e)=>setWallet(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={uploadQR}
          className="block w-full"
        />

        <button
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl"
        >
          {uploading ? "Uploading..." : "Save Wallet"}
        </button>

      </div>

    </div>

  );
}