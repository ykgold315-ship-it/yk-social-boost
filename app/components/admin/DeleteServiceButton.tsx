"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

export default function DeleteServiceButton({
  id,
}: {
  id: number;
}) {
  const router = useRouter();

  async function deleteService() {
    if (!confirm("Delete this service?")) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Service deleted successfully.");

    router.refresh();
  }

  return (
    <button
      onClick={deleteService}
      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
    >
      Delete
    </button>
  );
}