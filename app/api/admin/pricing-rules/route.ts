import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function GET() {
  const { data, error } = await adminClient
    .from("pricing_rules")
    .select("*")
    .order("id");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { error } = await adminClient
      .from("pricing_rules")
      .insert(body);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {

    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );

  }
}