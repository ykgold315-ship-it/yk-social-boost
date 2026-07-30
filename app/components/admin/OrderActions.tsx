"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: number;
}

export default function OrderActions({ orderId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(action: string) {
    setLoading(true);

    const res = await fetch("/api/admin/orders/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        action,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      return alert(data.error);
    }

    alert("Order updated successfully.");

    router.refresh();
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">

      <button
        onClick={() => update("processing")}
        disabled={loading}
        className="rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
      >
        Processing
      </button>

      <button
        onClick={() => update("complete")}
        disabled={loading}
        className="rounded-xl bg-green-600 py-3 font-semibold hover:bg-green-700"
      >
        Complete
      </button>

      <button
        onClick={() => update("refund")}
        disabled={loading}
        className="rounded-xl bg-yellow-600 py-3 font-semibold hover:bg-yellow-700"
      >
        Refund
      </button>

      <button
        onClick={() => update("cancel")}
        disabled={loading}
        className="rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700"
      >
        Cancel
      </button>

    </div>
  );
}