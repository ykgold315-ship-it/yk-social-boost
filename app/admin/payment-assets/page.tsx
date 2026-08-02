"use client";

import { useState } from "react";
import { createClient } from "@/lib/browser-client";

export default function PaymentAssetsPage() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("BTC");
  const [uploading, setUploading] = useState(false);

  async function uploadImage(e: any) {
    const file = e.target.files?.[0];
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

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("payment-assets")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("payment_assets")
      .insert({
        title,
        type,
        image_url: publicUrl,
      });

    setUploading(false);

    if (dbError) {
      alert(dbError.message);
      return;
    }

    alert("Image uploaded successfully.");

    setTitle("");
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Payment Assets
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
        >
          <option>BTC</option>
          <option>ETH</option>
          <option>USDT</option>
          <option>USDC</option>
          <option>BANK</option>
          <option>STRIPE</option>
        </select>

        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="block w-full"
        />

        <button
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-4 font-semibold"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

      </div>

    </div>
  );
}