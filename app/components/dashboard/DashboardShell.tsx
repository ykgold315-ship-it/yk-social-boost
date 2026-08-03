"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Permission = {
  can_create_customers?: boolean;
  can_create_subsellers?: boolean;
  can_view_reports?: boolean;
  can_use_api?: boolean;
};

type DashboardShellProps = {
  children: React.ReactNode;
  role: "admin" | "customer" | "subseller";
  permissions?: Permission;
};

export default function DashboardShell({
  children,
  role,
  permissions,
}: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar
        role={role}
        permissions={permissions}
        open={open}
        setOpen={setOpen}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          open ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        <Topbar
          open={open}
          setOpen={setOpen}
        />

        <div className="flex-1 p-8">
          {children}
        </div>
      </div>

    </main>
  );
}