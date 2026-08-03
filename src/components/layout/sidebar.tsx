"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCog,
  Package,
  Wallet,
  Dumbbell,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/miembros", label: "Miembros", icon: Users },
  { href: "/membresias", label: "Membresias", icon: CreditCard },
  { href: "/personal", label: "Personal", icon: UserCog },
  { href: "/inventario", label: "Inventario", icon: Package },
  { href: "/caja", label: "Caja", icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Dumbbell className="size-5" />
        <span className="font-heading text-sm font-semibold">GymSistem</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="border-t border-sidebar-border p-2">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70"
        >
          <LogOut className="size-4" />
          Cerrar sesion
        </Button>
      </form>
    </aside>
  );
}
