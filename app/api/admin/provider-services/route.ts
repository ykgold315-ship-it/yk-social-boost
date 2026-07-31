import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const providerId = searchParams.get("provider");

    let query = adminClient
      .from("provider_services")
      .select("*")
      .order("service_name");

    // Only filter if provider exists
    if (providerId && providerId !== "") {
      query = query.eq("provider_id", Number(providerId));
    }

    // Search service name
    if (search.trim() !== "") {
      query = query.ilike("service_name", `%${search}%`);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}