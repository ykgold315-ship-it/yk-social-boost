"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteOrderButton({
  orderId,
}: {
  orderId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteOrder() {
    if (!confirm("Delete this order permanently?")) return;

    setLoading(true);

    const res = await fetch("/api/admin/orders/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Order deleted successfully.");

    router.refresh();
  }

  return (
    <button
      onClick={deleteOrder}
      disabled={loading}
      className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}