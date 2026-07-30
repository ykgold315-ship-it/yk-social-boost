import { notFound } from "next/navigation";
import EditServiceForm from "./EditServiceForm";
import { createClient } from "@/lib/server-client";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (!service) {
    notFound();
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">
        Edit Service
      </h1>

      <EditServiceForm
        service={service}
        categories={categories ?? []}
      />
    </div>
  );
}