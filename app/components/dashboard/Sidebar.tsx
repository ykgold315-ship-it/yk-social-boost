"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Layers3,
  Wallet,
  LifeBuoy,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Add Funds",
    href: "/dashboard/add-funds",
    icon: CreditCard,
  },

  {
    name: "New Order",
    href: "/dashboard/orders/new",
    icon: ShoppingCart,
  },

  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },

  {
    name: "Services",
    href: "/dashboard/services",
    icon: Layers3,
  },

  { name: "Credits", 
    href: "/dashboard/credits",
     icon: Wallet 
  },

  {
    name: "Support",
    href: "/dashboard/support",
    icon: LifeBuoy,
  },

  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen border-r border-slate-800 bg-slate-950 flex flex-col">

      <div className="p-8 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-white">YK</span>{" "}
          <span className="text-blue-500">Social Boost</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Premium SMM Platform
        </p>
      </div>

      <nav className="flex-1 px-5 py-8 space-y-2">

        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}

      </nav>

      <div className="border-t border-slate-800 p-5">

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-slate-300 transition hover:bg-red-600 hover:text-white">

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}