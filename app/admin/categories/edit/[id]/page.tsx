"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/browser-client";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
    sort_order: 0,
    active: true,
  });

  useEffect(() => {
    async function loadCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      if (data) {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          icon: data.icon ?? "",
          sort_order: data.sort_order ?? 0,
          active: data.active ?? true,
        });
      }
    }

    loadCategory();
  }, [id]);

  async function saveCategory() {
    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .update({
        name: form.name,
        description: form.description,
        icon: form.icon,
        sort_order: form.sort_order,
        active: form.active,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Category updated successfully!");

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Edit Category
      </h1>

      <div className="space-y-5">

        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          placeholder="Category Name"
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Description"
          rows={4}
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
        />

        <input
          value={form.icon}
          onChange={(e) =>
            setForm({ ...form, icon: e.target.value })
          }
          placeholder="Icon"
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
        />

        <input
          type="number"
          value={form.sort_order}
          onChange={(e) =>
            setForm({
              ...form,
              sort_order: Number(e.target.value),
            })
          }
          placeholder="Sort Order"
          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />

          Active
        </label>

        <button
          disabled={loading}
          onClick={saveCategory}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}