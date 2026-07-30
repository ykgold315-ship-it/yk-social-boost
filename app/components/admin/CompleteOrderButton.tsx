"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteOrderButton({
  orderId,
}: {
  orderId: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function completeOrder() {
    if (!confirm("Mark this order as Completed?")) return;

    setLoading(true);

    const res = await fetch("/api/admin/orders/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        action: "complete",
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Order completed successfully.");

    router.refresh();
  }

  return (
    <button
      onClick={completeOrder}
      disabled={loading}
      className="rounded-lg bg-green-600 px-3 py-2 hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Updating..." : "Complete"}
    </button>
  );
}