"use client";

import { useState } from "react";

export default function UserActions({
  userId,
}: {
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function runAction(
    action: string,
    extra: any = {}
  ) {
    setLoading(true);

    const res = await fetch("/api/admin/users/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        action,
        ...extra,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      return alert(data.error);
    }

    alert("Action completed successfully.");

    window.location.reload();
  }

  async function addBalance() {
    const amount = prompt("Enter amount to add (£)");

    if (!amount) return;

    runAction("add_balance", {
      amount: Number(amount),
    });
  }

  async function deductBalance() {
    const amount = prompt("Enter amount to deduct (£)");

    if (!amount) return;

    runAction("deduct_balance", {
      amount: Number(amount),
    });
  }

  async function changeRole() {
    const role = prompt(
      "Enter role (admin or customer)"
    );

    if (!role) return;

    runAction("change_role", {
      role,
    });
  }

  async function suspendUser() {
    if (
      !confirm(
        "Suspend this account?"
      )
    ) {
      return;
    }

    runAction("suspend");
  }

  async function activateUser() {
    if (
      !confirm(
        "Activate this account?"
      )
    ) {
      return;
    }

    runAction("activate");
  }

  return (
    <div className="grid gap-4">

      <button
        onClick={addBalance}
        disabled={loading}
        className="rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
      >
        Add Wallet Balance
      </button>

      <button
        onClick={deductBalance}
        disabled={loading}
        className="rounded-xl bg-yellow-600 py-3 font-semibold hover:bg-yellow-700"
      >
        Deduct Wallet Balance
      </button>

      <button
        onClick={changeRole}
        disabled={loading}
        className="rounded-xl bg-purple-600 py-3 font-semibold hover:bg-purple-700"
      >
        Change Role
      </button>

      <button
        onClick={suspendUser}
        disabled={loading}
        className="rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700"
      >
        Suspend User
      </button>

      <button
        onClick={activateUser}
        disabled={loading}
        className="rounded-xl bg-green-600 py-3 font-semibold hover:bg-green-700"
      >
        Activate User
      </button>

    </div>
  );
}