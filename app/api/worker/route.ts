import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const supabase = await createApiClient();

    const { data: job } = await supabase
      .from("automation_jobs")
      .select("*")
      .eq("status", "Queued")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (!job) {
      return NextResponse.json({
        success: false,
        message: "No queued jobs found.",
      });
    }

    // STEP 1 - Processing
    await supabase
      .from("automation_jobs")
      .update({
        status: "Processing",
        progress: 10,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    await supabase
      .from("orders")
      .update({
        status: "Processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.order_id);

    // STEP 2 - Simulate work
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // STEP 3 - Finish job
    await supabase
      .from("automation_jobs")
      .update({
        status: "Completed",
        progress: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    await supabase
      .from("orders")
      .update({
        status: "Completed",
        remains: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.order_id);

    return NextResponse.json({
      success: true,
      message: "Automation completed successfully.",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Worker failed",
      },
      {
        status: 500,
      }
    );
  }
}