import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const supabase = await createApiClient();

    const { data, error } = await supabase
      .from("automation_logs")
      .select("*")
      .order("id", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);

  } catch {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}