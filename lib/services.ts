import { createClient } from "./server-client";

export async function getServices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("category");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}