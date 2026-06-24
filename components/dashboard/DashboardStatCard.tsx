import type { LucideIcon } from "lucide-react";

type Accent = "indigo" | "slate" | "orange" | "red" | "emerald" | "cyan";

const accentStyles: Record<
  Accent,
  { icon: string; value: string }
> = {
  indigo: {
    icon: "bg-indigo-50 text-indigo-600",
    value: "text-indigo-600",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    value: "text-slate-900",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    value: "text-orange-600",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    value: "text-red-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-600",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    value: "text-cyan-600",
  },
};

type DashboardStatCardProps = {
  label: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  accent?: Accent;
};

export function DashboardStatCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "indigo",
}: DashboardStatCardProps) {
  const styles = accentStyles[accent];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            Icon ? styles.icon : ""
          }`}
        >
          {Icon && <Icon className="h-4 w-4" />}
        </div>
      </div>

      <p className={`mt-2 text-3xl font-bold tracking-tight ${styles.value}`}>
        {value}
      </p>

      {description && (
        <p className="mt-1.5 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}
