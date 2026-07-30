"use client";

import { useEffect, useState } from "react";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeposits();
  }, []);

  async function loadDeposits() {
    const res = await fetch("/api/admin/deposits");

    const data = await res.json();

    if (Array.isArray(data)) {
      setDeposits(data);
    } else {
      console.error(data);
      setDeposits([]);
    }

    setLoading(false);
  }

  async function approveDeposit(id: number) {
    const res = await fetch("/api/admin/deposits/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        depositId: id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error);
    }

    alert("Deposit Approved!");

    loadDeposits();
  }

  async function rejectDeposit(id: number) {
    if (!confirm("Reject this deposit?")) return;

    const res = await fetch("/api/admin/deposits/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        depositId: id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error);
    }

    alert("Deposit Rejected!");

    loadDeposits();
  }

  async function deleteDeposit(id: number) {
    if (!confirm("Delete this deposit permanently?")) return;

    const res = await fetch("/api/admin/deposits/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        depositId: id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error);
    }

    alert("Deposit Deleted!");

    loadDeposits();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold">
        Deposit Requests
      </h1>

      <p className="mt-2 text-slate-400">
        Approve customer deposits.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="px-6 py-4 text-left">Customer</th>

              <th className="px-6 py-4 text-left">Amount</th>

              <th className="px-6 py-4 text-left">Method</th>

              <th className="px-6 py-4 text-left">Reference</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {deposits.map((deposit) => (

              <tr
                key={deposit.id}
                className="border-t border-slate-800"
              >

                <td className="px-6 py-5">
                  <p className="font-semibold">
                    {deposit.profiles?.full_name}
                  </p>

                  <p className="text-sm text-slate-400">
                    {deposit.profiles?.email}
                  </p>
                </td>

                <td className="px-6 py-5">
                  £{Number(deposit.amount).toFixed(2)}
                </td>

                <td className="px-6 py-5">
                  {deposit.payment_method}
                </td>

                <td className="px-6 py-5">
                  {deposit.transaction_reference}
                </td>

                <td className="px-6 py-5">
                  {deposit.status}
                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-2">

                    {deposit.status === "Pending" && (
                      <>
                        <button
                          onClick={() => approveDeposit(deposit.id)}
                          className="rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectDeposit(deposit.id)}
                          className="rounded-lg bg-yellow-600 px-4 py-2 hover:bg-yellow-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deleteDeposit(deposit.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}