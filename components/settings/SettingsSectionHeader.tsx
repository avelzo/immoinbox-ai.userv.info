import type { LucideIcon } from "lucide-react";

type SettingsSectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: string;
};

export function SettingsSectionHeader({
  icon: Icon,
  title,
  description,
  badge,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          {badge && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
    </div>
  );
}
