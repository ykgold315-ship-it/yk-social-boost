"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

export default function CloseTicketButton({
  ticketId,
}: {
  ticketId: number;
}) {
  const router = useRouter();

  async function closeTicket() {
    if (!confirm("Close this ticket?")) return;

    const { error } = await supabase
      .from("tickets")
      .update({
        status: "Closed",
      })
      .eq("id", ticketId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Ticket closed successfully.");

    router.refresh();
  }

  return (
    <button
      onClick={closeTicket}
      className="rounded-xl bg-green-600 px-5 py-3 hover:bg-green-700"
    >
      Close Ticket
    </button>
  );
}