type DashboardPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardPanel({
  children,
  className = "",
}: DashboardPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}
