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

export default function BankTransferPage() {
  const supabase = createClient();

  const [banks, setBanks] = useState<BankAccount[]>([]);

  useEffect(() => {
    loadBanks();
  }, []);

  async function loadBanks() {
    const { data } = await supabase
      .from("bank_accounts")
      .select("*");

    setBanks((data ?? []) as BankAccount[]);
  }

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Bank Transfer
      </h1>

      <div className="space-y-6">

        {banks.map((bank) => (

          <div
            key={bank.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >

            <h2 className="text-2xl font-bold mb-4">
              {bank.bank_name}
            </h2>

            <p><strong>Account Name:</strong> {bank.account_name}</p>

            <p><strong>Account Number:</strong> {bank.account_number}</p>

            <p><strong>Sort Code:</strong> {bank.sort_code}</p>

            <p><strong>IBAN:</strong> {bank.iban}</p>

            <p><strong>SWIFT:</strong> {bank.swift}</p>

            <p><strong>Currency:</strong> {bank.currency}</p>

            <p><strong>Country:</strong> {bank.country}</p>

          </div>

        ))}

      </div>

    </div>
  );
}