import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "text-white",
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className={`mt-3 text-4xl font-bold ${color}`}>
            {value}
          </h2>

        </div>

        <div className="text-blue-500 text-4xl">
          {icon}
        </div>

      </div>

    </div>
  );
}