import {
  LayoutDashboard,
  ShoppingCart,
  Layers3,
  Wallet,
  CreditCard,
  Users,
  UserPlus,
  LifeBuoy,
  Settings,
  Database,
  BarChart3,
  Shield,
} from "lucide-react";

export const customerMenu = [
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
  {
    name: "Credits",
    href: "/dashboard/credits",
    icon: Wallet,
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

export const resellerMenu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    permission: "can_create_customers",
  },
  {
    name: "Sub Resellers",
    href: "/dashboard/subsellers",
    icon: UserPlus,
    permission: "can_create_subsellers",
  },
  {
    name: "Credits",
    href: "/dashboard/credits",
    icon: Wallet,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    permission: "can_view_reports",
  },
  {
    name: "API",
    href: "/dashboard/api",
    icon: Database,
    permission: "can_use_api",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const adminMenu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Subsellers",
    href: "/admin/subsellers",
    icon: UserPlus,
  },
  {
    name: "Providers",
    href: "/admin/providers",
    icon: Database,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "System",
    href: "/admin/settings",
    icon: Shield,
  },
];