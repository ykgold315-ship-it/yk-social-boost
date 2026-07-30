import { supabase } from "./browser-client";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}