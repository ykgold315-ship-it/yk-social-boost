"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";

type StripeSettings = {
  publishable_key: string;
};

export default function StripePage() {
  const supabase = createClient();

  const [settings, setSettings] = useState<StripeSettings | null>(null);

  useEffect(() => {
    loadStripe();
  }, []);

  async function loadStripe() {
    const { data } = await supabase
      .from("stripe_settings")
      .select("*")
      .single();

    if (data) setSettings(data);
  }

  async function payNow() {
    alert(
      "Stripe Checkout will be connected after your client's Stripe Secret Key is added."
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Credit / Debit Card
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-4">
          Secure Stripe Checkout
        </h2>

        <p className="text-slate-400 mb-8">
          Visa • Mastercard • Apple Pay • Google Pay
        </p>

        <button
          onClick={payNow}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-4 font-semibold"
        >
          Continue to Secure Checkout
        </button>

        {settings && (
          <p className="mt-6 text-green-400">
            Stripe account connected successfully.
          </p>
        )}

      </div>

    </div>
  );
}