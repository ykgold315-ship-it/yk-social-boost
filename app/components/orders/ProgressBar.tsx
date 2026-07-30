"use client";

interface ProgressProps {
  progress: number;
  status: string;
}

export default function ProgressBar({
  progress,
  status,
}: ProgressProps) {
  return (
    <div className="w-full">

      <div className="flex justify-between mb-2">

        <span className="text-sm font-medium text-slate-300">
          {status}
        </span>

        <span className="text-sm font-bold text-blue-400">
          {progress}%
        </span>

      </div>

      <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}