type DashboardPageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function DashboardPageHeader({
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-anthracite">
          {title}
        </h1>

        <p className="mt-1 text-sm text-anthracite/60">{description}</p>
      </div>

      {action}
    </div>
  );
}
