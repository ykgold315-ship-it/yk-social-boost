import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString() || "";
    const api_url = formData.get("api_url")?.toString() || "";
    const api_key = formData.get("api_key")?.toString() || "";
    const priority = Number(formData.get("priority"));
    const status = formData.get("status")?.toString() || "Inactive";

    if (!id || !name || !api_url || !api_key) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const { error } = await adminClient
      .from("providers")
      .update({
        name,
        api_url,
        api_key,
        priority,
        status,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL("/admin/providers", request.url)
    );

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );

  }
}