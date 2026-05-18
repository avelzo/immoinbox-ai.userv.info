"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  Wrench,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  {
    label: "Emails",
    href: "/dashboard/emails",
    icon: Inbox,
  },
  {
    label: "Interventions",
    href: "/dashboard/interventions",
    icon: Wrench,
  },
  {
    label: "Statistiques",
    href: "/dashboard/stats",
    icon: BarChart3,
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed z-11 min-h-screen w-64 shrink-0 border-r bg-white px-4 py-6 md:block">
      <div className="mb-8 px-2">
        <Link
          href="/dashboard/emails"
          className="block text-xl font-bold text-slate-900"
        >
          ImmoInbox AI
        </Link>

        <p className="mt-1 text-sm text-slate-500">
          Assistant immobilier IA
        </p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                  : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}