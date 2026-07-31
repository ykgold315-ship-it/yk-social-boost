"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Layers3,
  FolderTree,
  Wallet,
  LifeBuoy,
  CreditCard,
  Cpu,
  Settings,
  Server,
  Bell,
  DollarSign,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Layers3,
  },
  {
    name: "Provider Services",
    href: "/admin/provider-services",
    icon: Server,
  },
  {
    name: "Service Mapper",
    href: "/admin/service-mapper",
    icon: Cpu,
  },
  {
    name: "Pricing",
    href: "/admin/pricing",
    icon: DollarSign,
  },
  {
    name: "Pricing Rules",
    href: "/admin/pricing-rules",
    icon: DollarSign,
  },
  {
    name: "Wallet",
    href: "/admin/wallet",
    icon: Wallet,
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: LifeBuoy,
  },
  {
    name: "Deposits",
    href: "/admin/deposits",
    icon: CreditCard,
  },
  {
    name: "Automation",
    href: "/admin/automation",
    icon: Cpu,
  },
  {
    name: "Providers",
    href: "/admin/providers",
    icon: Server,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-6">

      <h1 className="text-3xl font-bold text-white">
        YK <span className="text-blue-500">Admin</span>
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        Control Center
      </p>

      <nav className="mt-10 space-y-2">

        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}