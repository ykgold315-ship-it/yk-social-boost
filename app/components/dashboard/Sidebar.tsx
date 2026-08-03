"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
} from "lucide-react";

import {
  customerMenu,
  adminMenu,
  resellerMenu,
} from "./menu";

type Permission = {
  can_create_customers?: boolean;
  can_create_subsellers?: boolean;
  can_view_reports?: boolean;
  can_use_api?: boolean;
};

type SidebarProps = {
  role: "admin" | "customer" | "subseller";
  permissions?: Permission;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function Sidebar({
  role,
  permissions,
  open,
  setOpen,
}: SidebarProps) {
  const pathname = usePathname();

  let menu = customerMenu;

  if (role === "admin") {
    menu = adminMenu;
  }

  if (role === "subseller") {
    menu = resellerMenu.filter((item) => {
      if (!item.permission) return true;

      return permissions?.[
        item.permission as keyof Permission
      ];
    });
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen
          border-r border-slate-800 bg-slate-950
          transition-all duration-300
          ${
            open
              ? "w-72 translate-x-0"
              : "w-20 -translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          {open && (
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">YK</span>{" "}
                <span className="text-blue-500">
                  Social Boost
                </span>
              </h1>

              <p className="mt-1 text-xs text-slate-400">
                Premium SMM Platform
              </p>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

        <nav className="space-y-2 overflow-y-auto px-3 py-5">

          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />

                {open && (
                  <span>{item.name}</span>
                )}
              </Link>
            );
          })}

        </nav>

        <div className="border-t border-slate-800 p-4">

          <button className="flex w-full items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 hover:bg-red-600">

            <LogOut size={18} />

            {open && <span>Logout</span>}

          </button>

        </div>

      </aside>
    </>
  );
}