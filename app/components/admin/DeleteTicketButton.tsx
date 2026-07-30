"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

export default function DeleteTicketButton({
  ticketId,
}: {
  ticketId: number;
}) {
  const router = useRouter();

  async function deleteTicket() {
    if (!confirm("Delete this ticket permanently?")) return;

    const { error } = await supabase
      .from("tickets")
      .delete()
      .eq("id", ticketId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Ticket deleted successfully.");

    router.push("/admin/support");
    router.refresh();
  }

  return (
    <button
      onClick={deleteTicket}
      className="rounded-xl bg-red-600 px-5 py-3 hover:bg-red-700"
    >
      Delete Ticket
    </button>
  );
}