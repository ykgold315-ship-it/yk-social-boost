"use client";

import { useEffect, useState } from "react";

export default function PricingRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    rule_type: "global",
    profit_type: "percent",
    profit_value: 30,
    provider_id: "",
    category: "",
    active: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    const res = await fetch("/api/admin/pricing-rules");
    const data = await res.json();

    setRules(data);
    setLoading(false);
  }

  async function createRule() {
    if (!form.name) {
      alert("Rule name is required.");
      return;
    }

    const res = await fetch("/api/admin/pricing-rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        provider_id:
          form.provider_id === ""
            ? null
            : Number(form.provider_id),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Pricing Rule Created");

      setForm({
        name: "",
        rule_type: "global",
        profit_type: "percent",
        profit_value: 30,
        provider_id: "",
        category: "",
        active: true,
      });

      loadRules();
    } else {
      alert(data.error);
    }
  }

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Pricing Rules
        </h1>

        <p className="text-slate-400 mt-2">
          Automatically calculate selling prices.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">

        <input
          className="w-full rounded-xl bg-slate-800 p-3"
          placeholder="Rule Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">

          <select
            className="rounded-xl bg-slate-800 p-3"
            value={form.rule_type}
            onChange={(e) =>
              setForm({
                ...form,
                rule_type: e.target.value,
              })
            }
          >
            <option value="global">
              Global
            </option>

            <option value="provider">
              Provider
            </option>

            <option value="category">
              Category
            </option>
          </select>

          <select
            className="rounded-xl bg-slate-800 p-3"
            value={form.profit_type}
            onChange={(e) =>
              setForm({
                ...form,
                profit_type: e.target.value,
              })
            }
          >
            <option value="percent">
              Percent
            </option>

            <option value="fixed">
              Fixed
            </option>
          </select>

        </div>

        <input
          type="number"
          className="w-full rounded-xl bg-slate-800 p-3"
          placeholder="Profit Value"
          value={form.profit_value}
          onChange={(e) =>
            setForm({
              ...form,
              profit_value: Number(e.target.value),
            })
          }
        />

        <button
          onClick={createRule}
          className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700"
        >
          Create Rule
        </button>

      </div>

      <div className="rounded-2xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Rule
              </th>

              <th className="p-4 text-left">
                Profit
              </th>

              <th className="p-4 text-left">
                Type
              </th>

            </tr>

          </thead>

          <tbody>

            {rules.map((rule) => (

              <tr
                key={rule.id}
                className="border-t border-slate-800"
              >

                <td className="p-4">
                  {rule.name}
                </td>

                <td className="p-4">
                  {rule.rule_type}
                </td>

                <td className="p-4">
                  {rule.profit_value}
                </td>

                <td className="p-4">
                  {rule.profit_type}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}