"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";

type StripeSettings = {
  id?: string;
  publishable_key: string;
  secret_key: string;
  webhook_secret: string;
};

export default function StripeSettingsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<StripeSettings>({
    publishable_key: "",
    secret_key: "",
    webhook_secret: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("stripe_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setSettings(data);
    }

    setLoading(false);
  }

  async function saveSettings() {
    const { data } = await supabase
      .from("stripe_settings")
      .select("id")
      .limit(1)
      .single();

    let error;

    if (data) {
      ({ error } = await supabase
        .from("stripe_settings")
        .update({
          publishable_key: settings.publishable_key,
          secret_key: settings.secret_key,
          webhook_secret: settings.webhook_secret,
        })
        .eq("id", data.id));
    } else {
      ({ error } = await supabase
        .from("stripe_settings")
        .insert([
          {
            publishable_key: settings.publishable_key,
            secret_key: settings.secret_key,
            webhook_secret: settings.webhook_secret,
          },
        ]));
    }

    if (error) {
      alert(error.message);
      return;
    }

    alert("Stripe Settings Saved Successfully");
  }

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Stripe Settings
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">

        <div>
          <label className="block mb-2 text-slate-300">
            Publishable Key
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
            value={settings.publishable_key}
            onChange={(e) =>
              setSettings({
                ...settings,
                publishable_key: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-slate-300">
            Secret Key
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
            value={settings.secret_key}
            onChange={(e) =>
              setSettings({
                ...settings,
                secret_key: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-slate-300">
            Webhook Secret
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
            value={settings.webhook_secret}
            onChange={(e) =>
              setSettings({
                ...settings,
                webhook_secret: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={saveSettings}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold"
        >
          Save Stripe Settings
        </button>

      </div>

    </div>
  );
}