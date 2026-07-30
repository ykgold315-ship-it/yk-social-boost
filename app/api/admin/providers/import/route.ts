import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function POST(request: Request) {
  try {
    const { providerId } = await request.json();

    const supabase = adminClient;

    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", providerId)
      .single();

    if (error || !provider) {
      return NextResponse.json(
        {
          error: "Provider not found.",
        },
        { status: 404 }
      );
    }

    console.log("=================================");
    console.log("CONNECTING TO PROVIDER...");
    console.log("=================================");
    console.log("Provider:", provider.name);
    console.log("URL:", provider.api_url);

    const response = await fetch(provider.api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key: provider.api_key,
        action: "services",
      }),
    });

    if (!response.ok) {
      const text = await response.text();

      console.error("Provider HTTP Error");
      console.error(text);

      return NextResponse.json(
        {
          error: "Failed to connect to provider.",
          details: text,
        },
        { status: 500 }
      );
    }

    const services = await response.json();

    if (!Array.isArray(services)) {
      console.error("Invalid Provider Response");
      console.error(services);

      return NextResponse.json(
        {
          error: "Provider returned an invalid response.",
          response: services,
        },
        { status: 500 }
      );
    }

    const rows = services.map((service: any) => ({
      provider_id: provider.id,
      provider_service_id: String(service.service),
      platform: service.category ?? "General",
      service_name: service.name,
      rate: Number(service.rate),
      min: Number(service.min),
      max: Number(service.max),
    }));

    const { error: insertError } = await supabase
      .from("provider_services")
      .upsert(rows, {
        onConflict: "provider_id,provider_service_id",
      });

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        {
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    console.log("=================================");
    console.log("IMPORT COMPLETED");
    console.log("Imported:", rows.length);
    console.log("=================================");

    return NextResponse.json({
      success: true,
      provider: provider.name,
      imported: rows.length,
    });

  } catch (err: any) {

    console.error("=================================");
    console.error("IMPORT SERVICES ERROR");
    console.error("=================================");
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
        cause: err.cause,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}