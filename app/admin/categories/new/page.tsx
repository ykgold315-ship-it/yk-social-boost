"use client";

import { useState } from "react";
import { supabase } from "@/lib/browser-client";

export default function NewCategoryPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formElement = e.currentTarget;

    const form = new FormData(formElement);

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .insert({
        name: form.get("name"),
        description: form.get("description"),
        icon: form.get("icon"),
        sort_order: Number(form.get("sort_order")),
        active: true,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Category created!");

    formElement.reset();
  }

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold text-white mb-8">
        Add Category
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <input
          name="name"
          placeholder="Category Name"
          required
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <input
          name="icon"
          placeholder="Icon (Instagram, TikTok...)"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <input
          type="number"
          name="sort_order"
          defaultValue={0}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-white"
        >
          {loading ? "Saving..." : "Create Category"}
        </button>

      </form>

    </div>
  );
}