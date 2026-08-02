"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";
import { useParams } from "next/navigation";

export default function ManageCreditsPage() {
  const supabase = createClient();

  const { id } = useParams();

  const [subseller, setSubseller] = useState<any>(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    loadSubseller();
  }, []);

  async function loadSubseller() {
    const { data } = await supabase
      .from("subsellers")
      .select("*")
      .eq("id", id)
      .single();

    setSubseller(data);
  }

  async function addCredits() {
    if (!subseller) return;

    const totalCredits =
      Number(subseller.credits) + Number(amount);

    // Update subseller table
    const { error } = await supabase
      .from("subsellers")
      .update({
        credits: totalCredits,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    // Check if reseller already has a credits account
    const { data: account } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", subseller.user_id)
      .maybeSingle();

    if (account) {
      await supabase
        .from("credits")
        .update({
          credits: totalCredits,
        })
        .eq("user_id", subseller.user_id);
    } else {
      await supabase
        .from("credits")
        .insert({
          user_id: subseller.user_id,
          credits: totalCredits,
        });
    }

    alert("Credits Added Successfully");

    setAmount(0);

    loadSubseller();
  }

  return (
    <div className="max-w-3xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Manage Credits
      </h1>

      {subseller && (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">

          <div>

            <h2 className="text-3xl font-bold">
              {subseller.company_name}
            </h2>

            <p className="mt-4 text-green-400 text-5xl font-bold">
              {Number(subseller.credits).toLocaleString()}
            </p>

            <p className="text-slate-400">
              Current Credits
            </p>

          </div>

          <input
            type="number"
            placeholder="Credits to Add"
            value={amount}
            onChange={(e) =>
              setAmount(Number(e.target.value))
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />

          <button
            onClick={addCredits}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 font-bold"
          >
            Add Credits
          </button>

        </div>

      )}

    </div>
  );
}