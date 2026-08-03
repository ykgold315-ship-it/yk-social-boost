import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function POST(request: Request) {
  try {
    const {
      serviceId,
      providerServiceId,
    } = await request.json();

    const providerServiceValue =
      providerServiceId && String(providerServiceId).trim() !== "0"
        ? providerServiceId
        : null;

    const supabase = adminClient;

    const { error } = await supabase
      .from("services")
      .update({
        provider_service_id: providerServiceValue,
      })
      .eq("id", serviceId);

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