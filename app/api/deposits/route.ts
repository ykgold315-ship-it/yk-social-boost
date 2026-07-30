import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No authenticated user" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const payload = {
    user_id: user.id,
    amount: body.amount,
    payment_method: body.payment_method,
    status: "Pending",
  };

  const { data, error } = await supabase
    .from("deposits")
    .insert(payload)
    .select();

  return NextResponse.json({
    authUser: user.id,
    payload,
    data,
    error,
  });
}