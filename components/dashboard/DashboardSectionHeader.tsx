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
    <div className="flex items-start gap-3 border-b border-line px-5 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sage/30 text-forest">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-anthracite">{title}</h2>

        {description && (
          <p className="mt-0.5 text-sm text-anthracite/70">{description}</p>
        )}
      </div>
    </div>
  );
}
