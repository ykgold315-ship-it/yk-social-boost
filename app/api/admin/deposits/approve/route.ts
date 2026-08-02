import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { depositId } = await req.json();

  // Get deposit
  const { data: deposit, error } = await supabase
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .single();

  if (error || !deposit) {
    return NextResponse.json(
      { error: "Deposit not found" },
      { status: 404 }
    );
  }

  // Mark deposit approved
  await supabase
    .from("deposits")
    .update({
      status: "Approved",
    })
    .eq("id", depositId);

  // Get current credits
  const { data: creditRow } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", deposit.user_id)
    .single();

  if (creditRow) {
    await supabase
      .from("credits")
      .update({
        credits:
          Number(creditRow.credits) +
          Number(deposit.amount),
      })
      .eq("user_id", deposit.user_id);
  } else {
    await supabase
      .from("credits")
      .insert({
        user_id: deposit.user_id,
        credits: deposit.amount,
      });
  }

  return NextResponse.json({
    success: true,
  });
}