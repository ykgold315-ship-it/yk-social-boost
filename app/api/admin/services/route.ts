import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function GET() {
  try {

    const { data, error } = await adminClient
      .from("services")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (err: any) {

    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );

  }
}