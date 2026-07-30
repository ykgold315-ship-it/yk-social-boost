"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/browser-client";

type Category = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  active: boolean;
};

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (data) {
      setCategories(data);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function deleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Category deleted successfully.");

    loadCategories();
  }

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white"
        />

        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white"
        >
          + New Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th>Name</th>
              <th>Icon</th>
              <th>Status</th>
              <th>Sort</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((category) => (
              <tr
                key={category.id}
                className="border-t border-slate-800"
              >
                <td className="p-4">{category.id}</td>

                <td>{category.name}</td>

                <td>{category.icon}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      category.active
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {category.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{category.sort_order}</td>

                <td className="text-right pr-6 space-x-3">
                  <Link
                    href={`/admin/categories/edit/${category.id}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}