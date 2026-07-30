"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

export default function ReplyTicketForm({
  ticketId,
}: {
  ticketId: number;
}) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendReply() {
    if (!message.trim()) {
      alert("Enter a reply.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticketId,
        sender: "admin",
        message,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("");

    alert("Reply sent successfully.");

    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold mb-5">
        Reply
      </h2>

      <textarea
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your reply..."
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-4"
      />

      <button
        onClick={sendReply}
        disabled={loading}
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700"
      >
        {loading ? "Sending..." : "Send Reply"}
      </button>

    </div>
  );
}