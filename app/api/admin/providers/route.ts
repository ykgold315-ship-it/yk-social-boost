import { NextResponse } from "next/server";
import { createClient } from "@/lib/server-client";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const api_url = formData.get("api_url")?.toString();
    const api_key = formData.get("api_key")?.toString();
    const priority = Number(formData.get("priority"));

    if (!name || !api_url || !api_key) {
      return NextResponse.json(
        {
          error: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("providers")
      .insert({
        name,
        api_url,
        api_key,
        priority,
        status: "Active",
        balance: 0,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.redirect(
      new URL("/admin/providers", req.url)
    );

  } catch (err) {
    return NextResponse.json(
      {
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}