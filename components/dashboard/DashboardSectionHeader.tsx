import type { LucideIcon } from "lucide-react";

type DashboardSectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export function DashboardSectionHeader({
  icon: Icon,
  title,
  description,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-0.5 text-sm text-slate-600">{description}</p>
        )}
      </div>
    </div>
  );
}
