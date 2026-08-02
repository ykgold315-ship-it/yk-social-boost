"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";

type BankAccount = {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  sort_code: string;
  iban: string;
  swift: string;
  currency: string;
  country: string;
};

export default function PaymentSettingsPage() {
  const supabase = createClient();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  const [form, setForm] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
    sort_code: "",
    iban: "",
    swift: "",
    currency: "USD",
    country: "",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAccounts((data ?? []) as BankAccount[]);
  }

  async function saveAccount() {
    const { error } = await supabase.from("bank_accounts").insert([
      {
        bank_name: form.bank_name,
        account_name: form.account_name,
        account_number: form.account_number,
        sort_code: form.sort_code,
        iban: form.iban,
        swift: form.swift,
        currency: form.currency,
        country: form.country,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Bank Account Saved");

    setForm({
      bank_name: "",
      account_name: "",
      account_number: "",
      sort_code: "",
      iban: "",
      swift: "",
      currency: "USD",
      country: "",
    });

    loadAccounts();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">

      <h1 className="text-4xl font-bold mb-8">
        Payment Settings
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-5">

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Bank Name"
          value={form.bank_name}
          onChange={(e) =>
            setForm({ ...form, bank_name: e.target.value })
          }
        />

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Account Name"
          value={form.account_name}
          onChange={(e) =>
            setForm({ ...form, account_name: e.target.value })
          }
        />

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Account Number"
          value={form.account_number}
          onChange={(e) =>
            setForm({ ...form, account_number: e.target.value })
          }
        />

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Sort Code"
          value={form.sort_code}
          onChange={(e) =>
            setForm({ ...form, sort_code: e.target.value })
          }
        />

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="IBAN"
          value={form.iban}
          onChange={(e) =>
            setForm({ ...form, iban: e.target.value })
          }
        />

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="SWIFT"
          value={form.swift}
          onChange={(e) =>
            setForm({ ...form, swift: e.target.value })
          }
        />

        <select
          className="bg-slate-950 border border-slate-700 text-white p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          value={form.currency}
          onChange={(e) =>
            setForm({ ...form, currency: e.target.value })
          }
        >
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
        </select>

        <input
          className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Country"
          value={form.country}
          onChange={(e) =>
            setForm({ ...form, country: e.target.value })
          }
        />

        <button
          onClick={saveAccount}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition rounded-xl py-3 font-semibold shadow-lg"
        >
          Save Bank Account
        </button>

      </div>

      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Existing Accounts
        </h2>

        {accounts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-400">
            No bank accounts added yet.
          </div>
        ) : (
          <div className="space-y-5">
            {accounts.map((bank) => (
              <div
                key={bank.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-white">
                  {bank.bank_name}
                </h3>

                <div className="mt-3 space-y-1 text-slate-300">
                  <p>
                    <strong>Account Name:</strong> {bank.account_name}
                  </p>

                  <p>
                    <strong>Account Number:</strong> {bank.account_number}
                  </p>

                  <p>
                    <strong>Sort Code:</strong> {bank.sort_code}
                  </p>

                  <p>
                    <strong>IBAN:</strong> {bank.iban}
                  </p>

                  <p>
                    <strong>SWIFT:</strong> {bank.swift}
                  </p>

                  <p>
                    <strong>Currency:</strong> {bank.currency}
                  </p>

                  <p>
                    <strong>Country:</strong> {bank.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}