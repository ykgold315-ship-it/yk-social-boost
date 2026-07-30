import CategoryTable from "@/app/components/admin/CategoryTable";

export default function CategoriesPage() {
  return (
    <div>

      <h1 className="text-4xl font-bold text-white">
        Categories
      </h1>

      <p className="text-slate-400 mt-2 mb-8">
        Manage all service categories.
      </p>

      <CategoryTable />

    </div>
  );
}