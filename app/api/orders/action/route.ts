import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";

export async function POST(request: Request) {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { orderId, action } = await request.json();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  switch (action) {

    case "processing":

      await supabase
        .from("orders")
        .update({
          status: "Processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      break;

    case "complete":

      await supabase
        .from("orders")
        .update({
          status: "Completed",
          remains: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      break;

    case "cancel":

      await supabase
        .from("orders")
        .update({
          status: "Cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      break;

    case "refund":

      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", order.user_id)
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
            Number(wallet.balance) +
            Number(order.charge),
        })
        .eq("user_id", order.user_id);

      await supabase
        .from("orders")
        .update({
          status: "Refunded",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      break;

    default:

      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
  }

  return NextResponse.json({
    success: true,
  });

}