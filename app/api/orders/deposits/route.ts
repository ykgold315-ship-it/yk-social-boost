import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/api-client";

export async function POST(request: Request) {
  const supabase = await createApiClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { amount, payment_method } = await request.json();

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("deposits")
    .insert({
      user_id: user.id,
      amount,
      payment_method,
      status: "Pending",
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}