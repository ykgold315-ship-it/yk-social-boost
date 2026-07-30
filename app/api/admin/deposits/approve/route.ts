import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { depositId } = await request.json();

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

  if (deposit.status === "Approved") {
    return NextResponse.json(
      { error: "Deposit already approved" },
      { status: 400 }
    );
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", deposit.user_id)
    .single();

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet not found" },
      { status: 404 }
    );
  }

  await supabase
    .from("wallets")
    .update({
      balance:
        Number(wallet.balance) + Number(deposit.amount),
    })
    .eq("user_id", deposit.user_id);

  await supabase
    .from("deposits")
    .update({
      status: "Approved",
    })
    .eq("id", deposit.id);

  return NextResponse.json({
    success: true,
  });
}