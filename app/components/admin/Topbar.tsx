"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-5">

      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-6">

        <button className="relative">
          <Bell size={22} />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={38} />

          <div>
            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-sm text-slate-400">
              Super Admin
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}