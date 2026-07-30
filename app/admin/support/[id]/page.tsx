import { notFound } from "next/navigation";
import { createClient } from "@/lib/server-client";

import ReplyTicketForm from "@/app/components/admin/ReplyTicketForm";
import CloseTicketButton from "@/app/components/admin/CloseTicketButton";
import DeleteTicketButton from "@/app/components/admin/DeleteTicketButton";

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (!ticket) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,email")
    .eq("id", ticket.user_id)
    .single();

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Ticket #{ticket.id}
        </h1>

        <p className="text-slate-400 mt-2">
          Support Conversation
        </p>

      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">

        <div>

          <p className="text-slate-400 text-sm">
            Customer
          </p>

          <h2 className="text-xl font-semibold">
            {profile?.full_name ?? "Unknown User"}
          </h2>

          <p className="text-slate-500">
            {profile?.email}
          </p>

        </div>

        <div>

          <p className="text-slate-400 text-sm">
            Subject
          </p>

          <h2 className="text-2xl font-bold">
            {ticket.subject}
          </h2>

        </div>

        <div>

          <p className="text-slate-400 text-sm mb-2">
            Customer Message
          </p>

          <div className="rounded-xl bg-slate-800 p-5">
            {ticket.message}
          </div>

        </div>

        <div className="flex gap-4">

          <CloseTicketButton
            ticketId={ticket.id}
          />

          <DeleteTicketButton
            ticketId={ticket.id}
          />

        </div>

      </div>

      <ReplyTicketForm
        ticketId={ticket.id}
      />

    </div>
  );
}