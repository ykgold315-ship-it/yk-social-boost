"use client";

import { Bell, Search, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/browser-client";

export default function Topbar() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("User");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        setFullName(profile.full_name);
      }
    }

    loadUser();
  }, []);

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8">

      <div className="relative w-full max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search services..."
          className="w-full rounded-xl bg-slate-900 border border-slate-800 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell size={22} className="text-gray-300" />

          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500"></span>

        </button>

        <div className="flex items-center gap-3">

          <UserCircle
            size={38}
            className="text-blue-500"
          />

          <div>

            <p className="font-semibold text-white">
              {fullName}
            </p>

            <p className="text-sm text-slate-400">
              {email}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}