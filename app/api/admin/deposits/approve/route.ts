import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const { depositId } = await req.json();

    // Get Deposit
    const { data: deposit, error } = await supabase
      .from("deposits")
      .select("*")
      .eq("id", depositId)
      .single();

    if (error || !deposit) {
      return NextResponse.json(
        {
          error: "Deposit not found",
        },
        {
          status: 404,
        }
      );
    }

    // Prevent double approval
    if (deposit.status === "Approved") {
      return NextResponse.json(
        {
          error: "Deposit already approved.",
        },
        {
          status: 400,
        }
      );
    }

    // Update Deposit
    const { error: depositError } = await supabase
      .from("deposits")
      .update({
        status: "Approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", depositId);

    if (depositError) {
      return NextResponse.json(
        {
          error: depositError.message,
        },
        {
          status: 400,
        }
      );
    }

    // Credits
    const { data: wallet } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", deposit.user_id)
      .single();

    if (wallet) {
      await supabase
        .from("credits")
        .update({
          credits:
            Number(wallet.credits) +
            Number(deposit.amount),
        })
        .eq("user_id", deposit.user_id);
    } else {
      await supabase
        .from("credits")
        .insert({
          user_id: deposit.user_id,
          credits: Number(deposit.amount),
        });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}