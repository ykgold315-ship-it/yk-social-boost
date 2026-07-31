"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}