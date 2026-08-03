"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSubsellerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    company_name: "",
    credits: 0,
    discount_percent: 0,

    can_create_customers: true,
    can_create_subsellers: false,
    can_transfer_credits: false,
    can_use_api: false,
    can_view_reports: false,
    can_manage_prices: false,
  });

  async function createSubseller() {
    setLoading(true);

    const res = await fetch("/api/admin/create-subseller", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(result.error);
      return;
    }

    alert("Subseller Created Successfully");

    router.push("/admin/subsellers");
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Create New Subseller
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">

        <div>
          <label className="block mb-2 font-semibold">
            Email
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
            value={form.email}
            onChange={(e)=>
              setForm({...form,email:e.target.value})
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Password
          </label>

          <input
            type="password"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
            value={form.password}
            onChange={(e)=>
              setForm({...form,password:e.target.value})
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Company Name
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
            value={form.company_name}
            onChange={(e)=>
              setForm({...form,company_name:e.target.value})
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Starting Credits
          </label>

          <input
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
            value={form.credits}
            onChange={(e)=>
              setForm({...form,credits:Number(e.target.value)})
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Discount %
          </label>

          <input
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
            value={form.discount_percent}
            onChange={(e)=>
              setForm({...form,discount_percent:Number(e.target.value)})
            }
          />
        </div>

        <hr className="border-slate-700"/>

        <h2 className="text-2xl font-bold">
          Permissions
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.can_create_customers}
              onChange={(e)=>
                setForm({
                  ...form,
                  can_create_customers:e.target.checked,
                })
              }
            />

            Can Create Customers

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.can_create_subsellers}
              onChange={(e)=>
                setForm({
                  ...form,
                  can_create_subsellers:e.target.checked,
                })
              }
            />

            Can Create Resellers

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.can_transfer_credits}
              onChange={(e)=>
                setForm({
                  ...form,
                  can_transfer_credits:e.target.checked,
                })
              }
            />

            Can Transfer Credits

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.can_use_api}
              onChange={(e)=>
                setForm({
                  ...form,
                  can_use_api:e.target.checked,
                })
              }
            />

            Can Use API

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.can_view_reports}
              onChange={(e)=>
                setForm({
                  ...form,
                  can_view_reports:e.target.checked,
                })
              }
            />

            Can View Reports

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.can_manage_prices}
              onChange={(e)=>
                setForm({
                  ...form,
                  can_manage_prices:e.target.checked,
                })
              }
            />

            Can Manage Prices

          </label>

        </div>

        <button
          onClick={createSubseller}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 font-bold"
        >
          {loading ? "Creating..." : "Create Subseller"}
        </button>

      </div>

    </div>
  );
}