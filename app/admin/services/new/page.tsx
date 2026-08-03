"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/browser-client";

type Category = {
  id: number;
  name: string;
};

export default function NewServicePage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (data) {
      setCategories(data);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formElement = e.currentTarget;

    setLoading(true);

    const form = new FormData(formElement);

    const categoryId = Number(form.get("category_id"));

const selectedCategory = categories.find(
  (category) => category.id === categoryId
);

const { error } = await supabase
  .from("services")
  .insert({
    category_id: categoryId,
    category: selectedCategory?.name ?? "",

    name: form.get("name"),
    description: form.get("description"),

    price: Number(form.get("price")),

    min_order: Number(form.get("min_order")),
    max_order: Number(form.get("max_order")),

    delivery_time: form.get("delivery_time"),

    status: form.get("status"),
    active: form.get("status") === "Active",

    provider: "YK Social Boost",
    provider_service_id: null,
    api_price: 0,
    profit: 0,
    average_time: "",
  });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Service created successfully!");

    formElement.reset();
  }

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold text-white mb-8">
        Add New Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <select
          name="category_id"
          required
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        >
          <option value="">
            Select Category
          </option>

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
          placeholder="Service Name"
          required
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

          <input
            type="text"
            name="delivery_time"
            placeholder="Delivery Time"
            className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

          <input
            type="number"
            name="min_order"
            placeholder="Minimum Order"
            required
            className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

          <input
            type="number"
            name="max_order"
            placeholder="Maximum Order"
            required
            className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
          />

        </div>

        <select
          name="status"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        >
          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Create Service"}
        </button>

      </form>

    </div>
  );
}