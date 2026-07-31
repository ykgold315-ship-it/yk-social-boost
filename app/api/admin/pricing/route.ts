import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-client";

export async function POST(request: Request) {
  try {
    const {
      serviceId,
      profitType,
      profitValue,
    } = await request.json();

    const supabase = adminClient;

    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .single();

    if (error || !service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const cost = Number(service.provider_cost);

    let sellingPrice = cost;

    if (profitType === "fixed") {
      sellingPrice = cost + Number(profitValue);
    }

    if (profitType === "percent") {
      sellingPrice =
        cost + (cost * Number(profitValue)) / 100;
    }

    const { error: updateError } = await supabase
      .from("services")
      .update({
        profit_type: profitType,
        profit_value: Number(profitValue),
        selling_price: Number(sellingPrice.toFixed(4)),
      })
      .eq("id", serviceId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sellingPrice,
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