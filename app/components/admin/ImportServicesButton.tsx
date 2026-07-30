"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportServicesButton({
  providerId,
}: {
  providerId: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function importServices() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/providers/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Import failed.");
        return;
      }

      alert(
        `Successfully imported ${result.imported} services from ${result.provider}.`
      );

      router.refresh();

    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={importServices}
      disabled={loading}
      className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Importing..." : "Import Services"}
    </button>
  );
}