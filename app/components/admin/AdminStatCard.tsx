import { ReactNode } from "react";

interface AdminStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
}

export default function AdminStatCard({
  title,
  value,
  change,
  icon,
}: AdminStatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400">
          {icon}
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
          {change}
        </span>
      </div>

      <h3 className="mt-6 text-sm text-slate-400">
        {title}
      </h3>

      <p className="mt-2 text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}