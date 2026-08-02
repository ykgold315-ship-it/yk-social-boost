import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      company_name,
      credits,
      discount_percent,
    } = body;

    // Create Auth User
    const { data: authData, error: authError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const user = authData.user;

    // Create credits account
    const { error: creditError } = await admin
      .from("credits")
      .insert({
        user_id: user.id,
        credits: Number(credits),
      });

    if (creditError) {
      return NextResponse.json(
        { error: creditError.message },
        { status: 400 }
      );
    }

    // Create subseller
    const { error: subError } = await admin
      .from("subsellers")
      .insert({
        user_id: user.id,
        company_name,
        credits: Number(credits),
        discount_percent: Number(discount_percent),
        active: true,
      });

    if (subError) {
      return NextResponse.json(
        { error: subError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}