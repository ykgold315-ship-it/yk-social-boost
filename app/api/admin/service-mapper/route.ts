import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function POST(request: Request) {
  try {
    const { serviceId, providerServiceId } = await request.json();

    if (!serviceId || !providerServiceId) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const { error } = await adminClient
      .from("services")
      .update({
        provider_service_id: providerServiceId,
      })
      .eq("id", serviceId);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {

    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}