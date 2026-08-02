"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/browser-client";

type Subseller = {
  id: string;
  company_name: string;
  credits: number;
  discount_percent: number;
  active: boolean;
};

export default function SubsellersPage() {
  const supabase = createClient();

  const [subsellers, setSubsellers] = useState<Subseller[]>([]);

  useEffect(() => {
    loadSubsellers();
  }, []);

  async function loadSubsellers() {
    const { data, error } = await supabase
      .from("subsellers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setSubsellers((data ?? []) as Subseller[]);
  }

  return (
    <div className="max-w-7xl mx-auto p-8 text-white">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          Subsellers
        </h1>

        <Link
          href="/admin/subsellers/new"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
        >
          + New Subseller
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>
              <th className="text-left px-6 py-4">
                Company
              </th>

              <th className="text-left px-6 py-4">
                Credits
              </th>

              <th className="text-left px-6 py-4">
                Discount %
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>

              <th className="text-left px-6 py-4">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {subsellers.length > 0 ? (

              subsellers.map((sub) => (

                <tr
                  key={sub.id}
                  className="border-t border-slate-800"
                >

                  <td className="px-6 py-5">
                    {sub.company_name}
                  </td>

                  <td className="px-6 py-5">
                    {Number(sub.credits).toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    {sub.discount_percent}%
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        sub.active
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {sub.active ? "Active" : "Disabled"}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <Link
                      href={`/admin/subsellers/${sub.id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                    >
                      Manage Credits
                    </Link>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={5}
                  className="text-center py-10 text-slate-400"
                >
                  No Subsellers Yet
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}