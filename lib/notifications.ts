import { createClient } from "@/lib/server-client";

export async function createNotification({
  title,
  message,
  type = "info",
  userId = null,
}: {
  title: string;
  message: string;
  type?: string;
  userId?: string | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .insert({
      title,
      message,
      type,
      user_id: userId,
    });

  if (error) {
    console.error("Notification Error:", error.message);
  }
}