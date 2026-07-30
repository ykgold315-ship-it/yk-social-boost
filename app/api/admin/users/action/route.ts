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

  const { data: admin } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (admin?.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const {
    userId,
    action,
    amount,
    role,
  } = await request.json();

  switch (action) {

    case "add_balance": {

      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          balance:
            Number(profile.balance) + Number(amount),
        })
        .eq("id", userId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      break;
    }

    case "deduct_balance": {

      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const balance =
        Number(profile.balance) - Number(amount);

      const { error } = await supabase
        .from("profiles")
        .update({
          balance: balance < 0 ? 0 : balance,
        })
        .eq("id", userId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      break;
    }

    case "change_role": {

      const { error } = await supabase
        .from("profiles")
        .update({
          role,
        })
        .eq("id", userId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      break;
    }

    case "suspend": {

      const { error } = await supabase
        .from("profiles")
        .update({
          status: "Suspended",
        })
        .eq("id", userId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      break;
    }

    case "activate": {

      const { error } = await supabase
        .from("profiles")
        .update({
          status: "Active",
        })
        .eq("id", userId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      break;
    }

    default:
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
  }

  return NextResponse.json({
    success: true,
  });
}