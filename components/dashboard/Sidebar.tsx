"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Mail,
  Wrench,
  BarChart2,
  BookOpen,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export type SidebarProps = {
  organizationName: string;
  email: string;
  name: string | null;
  newCount: number;
  urgentCount: number;
  interventionCount: number;
  onNavigate?: () => void;
};

export function Sidebar({
  organizationName,
  email,
  name,
  newCount,
  urgentCount,
  interventionCount,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = [
    {
      label: "Boîte de réception",
      href: "/dashboard/emails",
      icon: Mail,
      count: newCount,
    },
    {
      label: "Interventions",
      href: "/dashboard/interventions",
      icon: Wrench,
      count: interventionCount,
    },
    { label: "Statistiques", href: "/dashboard/stats", icon: BarChart2 },
    {
      label: "Guide de démonstration",
      href: "/dashboard/demo",
      icon: BookOpen,
    },
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ];
  const initials = (name || email)
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function logout() {
    setLoading(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Déconnexion impossible");
      router.push("/login");
      router.refresh();
    } catch {
      setError("Déconnexion impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="flex h-full flex-col bg-forest text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link
          href="/dashboard/emails"
          onClick={onNavigate}
          aria-label="ImmoInbox AI, boîte de réception"
        >
          <LogoMark size={22} light />
        </Link>
        <p className="mt-3 truncate px-1 text-xs font-medium text-white/60">
          {organizationName}
        </p>
      </div>
      {urgentCount > 0 && (
        <Link
          href="/dashboard/emails?urgent=true&status=NEW"
          onClick={onNavigate}
          className="mx-3 mt-3 rounded-lg border border-red-400/30 bg-red-500/20 px-3 py-2 hover:bg-red-500/30"
        >
          <p className="text-xs font-semibold text-red-200">
            {urgentCount} demande{urgentCount > 1 ? "s" : ""} urgente
            {urgentCount > 1 ? "s" : ""}
          </p>
          <p className="mt-0.5 text-[11px] text-red-200/80">
            À traiter en priorité
          </p>
        </Link>
      )}
      <nav
        aria-label="Navigation principale"
        className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3"
      >
        {navigation.map(({ label, href, icon: Icon, count }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                (active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white")
              }
            >
              <Icon size={16} strokeWidth={1.75} className="shrink-0" />
              <span className="min-w-0 flex-1">{label}</span>
              {count ? (
                <span
                  className={
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
                    (href.endsWith("emails") && urgentCount > 0
                      ? "bg-red-500"
                      : "bg-white/20")
                  }
                >
                  {count}
                </span>
              ) : active ? (
                <ChevronRight size={12} className="shrink-0 opacity-50" />
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-3 pb-4 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-bold text-forest">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{name || email}</p>
            <p className="truncate text-[10px] text-white/60">{email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loading}
            aria-label="Déconnexion"
            title="Déconnexion"
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut size={14} />
          </button>
        </div>
        {error && (
          <p role="alert" className="px-3 text-xs text-red-200">
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}
