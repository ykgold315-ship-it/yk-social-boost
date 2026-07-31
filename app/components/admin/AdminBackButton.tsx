"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/admin") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="mb-8 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:border-blue-500 hover:bg-slate-800"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}