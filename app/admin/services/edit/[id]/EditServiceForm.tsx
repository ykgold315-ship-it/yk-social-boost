"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

type Category = {
  id: number;
  name: string;
};

type Service = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  min_order: number;
  max_order: number;
  delivery_time: string;
  status: string;
  active: boolean;
  provider: string | null;
  provider_service_id: string | null;
  api_price: number | null;
  profit: number | null;
  average_time: string | null;
};

export default function EditServiceForm({
  service,
  categories,
}: {
  service: Service;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);

    const { error } = await supabase
      .from("services")
      .update({
        category_id: Number(form.get("category_id")),
        name: form.get("name"),
        description: form.get("description"),
        price: Number(form.get("price")),
        min_order: Number(form.get("min_order")),
        max_order: Number(form.get("max_order")),
        delivery_time: form.get("delivery_time"),
        provider: form.get("provider"),
       provider_service_id:
  form.get("provider_service_id")
    ? Number(form.get("provider_service_id"))
    : null,
        api_price: Number(form.get("api_price")),
        profit: Number(form.get("profit")),
        average_time: form.get("average_time"),
        status: form.get("status"),
        active: form.get("status") === "Active",
      })
      .eq("id", service.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Service updated successfully.");

    router.push("/admin/services");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <select
        name="category_id"
        defaultValue={service.category_id}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
      >
        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>

      <input
        name="name"
        defaultValue={service.name}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
      />

      <textarea
        name="description"
        defaultValue={service.description}
        rows={4}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          name="price"
          defaultValue={service.price}
          placeholder="Selling Price"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          type="number"
          name="api_price"
          defaultValue={service.api_price ?? 0}
          placeholder="API Price"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          type="number"
          name="profit"
          defaultValue={service.profit ?? 0}
          placeholder="Profit"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          type="text"
          name="delivery_time"
          defaultValue={service.delivery_time}
          placeholder="Delivery Time"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          type="number"
          name="min_order"
          defaultValue={service.min_order}
          placeholder="Minimum Order"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          type="number"
          name="max_order"
          defaultValue={service.max_order}
          placeholder="Maximum Order"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          name="provider"
          defaultValue={service.provider ?? ""}
          placeholder="Provider"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          name="provider_service_id"
          defaultValue={service.provider_service_id ?? ""}
          placeholder="Provider Service ID"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />

        <input
          name="average_time"
          defaultValue={service.average_time ?? ""}
          placeholder="Average Time"
          className="rounded-xl bg-slate-800 border border-slate-700 p-3"
        />
      </div>

      <select
        name="status"
        defaultValue={service.status}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <button
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
      >
        {loading ? "Updating..." : "Update Service"}
      </button>
    </form>
  );
}