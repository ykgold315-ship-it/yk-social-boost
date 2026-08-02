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
    <div className="max-w-3xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Create New Subseller
      </h1>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">

        <div>
          <label className="block mb-2 font-semibold">
            Email Address
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

          <p className="text-sm text-slate-400 mt-2">
            Example: <b>Ykgold@2026</b>
          </p>
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
            Discount (%)
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