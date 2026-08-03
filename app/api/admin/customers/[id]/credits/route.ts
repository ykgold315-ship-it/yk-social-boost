import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const form = await req.formData();

    const amount = Number(form.get("credits"));

    const action = String(form.get("action"));

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          error: "Invalid credits amount",
        },
        {
          status: 400,
        }
      );
    }

    const { data: wallet, error } = await admin
      .from("credits")
      .select("*")
      .eq("user_id", id)
      .single();

    if (error || !wallet) {
      return NextResponse.json(
        {
          error: "Credits account not found",
        },
        {
          status: 404,
        }
      );
    }

    let newCredits = Number(wallet.credits);

    if (action === "add") {
      newCredits += amount;
    } else {
      newCredits -= amount;

      if (newCredits < 0) {
        newCredits = 0;
      }
    }

    const { error: updateError } = await admin
      .from("credits")
      .update({
        credits: newCredits,
      })
      .eq("user_id", id);

    if (updateError) {
      return NextResponse.json(
        {
          error: updateError.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.redirect(
      new URL(`/admin/customers/${id}/credits`, req.url)
    );

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