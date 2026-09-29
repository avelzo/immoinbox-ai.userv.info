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
    <div className="flex items-start gap-3 border-b border-line px-5 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sage/30 text-forest">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-anthracite">{title}</h2>

          {badge && (
            <span className="rounded-full bg-sage/30 px-2.5 py-0.5 text-xs font-medium text-anthracite/70">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-anthracite/70">{description}</p>
        )}
      </div>
    </div>
  );
}
