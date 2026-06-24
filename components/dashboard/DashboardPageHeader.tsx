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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-slate-600">{description}</p>
      </div>

      {action}
    </div>
  );
}
