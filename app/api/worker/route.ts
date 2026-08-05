import { NextResponse } from "next/server";
import { processNextJobRequest } from "@/lib/order-service";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    const result = await processNextJobRequest(secret);

    if (!result.success) {
      const errorMessage = "error" in result ? result.error : result.message;
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Worker route error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
