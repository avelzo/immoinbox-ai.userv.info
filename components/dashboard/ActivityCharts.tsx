type Series = { label: string; count: number; color: string }[];

export function WeeklyChart({
  days,
}: {
  days: { label: string; count: number }[];
}) {
  const maximum = Math.max(1, ...days.map((day) => day.count));
  return (
    <div className="flex h-[200px] items-end gap-3 border-b border-line pb-6 pt-4">
      {days.map((day, index) => (
        <div
          key={index}
          className="relative flex h-full flex-1 flex-col justify-end text-center"
        >
          <span className="mb-1 text-xs text-anthracite/60">{day.count}</span>
          <div
            className="mx-auto w-6 max-w-full rounded-t-md bg-forest"
            style={{
              height: Math.max(day.count ? 4 : 0, (day.count / maximum) * 135),
            }}
          />
          <span className="absolute -bottom-5 w-full text-[10px] text-anthracite/60">
            {day.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CategoryChart({ series }: { series: Series }) {
  const total = series.reduce((sum, item) => sum + item.count, 0);
  let position = 0;
  const gradient = series
    .filter((item) => item.count)
    .map((item) => {
      const start = position;
      position += (item.count / total) * 100;
      return item.color + " " + start + "% " + position + "%";
    })
    .join(", ");
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 py-4">
      <div
        role="img"
        aria-label={
          total
            ? series.map((item) => item.label + " : " + item.count).join(", ")
            : "Aucun email"
        }
        className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
        style={{
          background: total ? "conic-gradient(" + gradient + ")" : "#e8ede9",
        }}
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-bold text-forest">{total}</span>
          <span className="text-[10px] text-anthracite/60">emails</span>
        </div>
      </div>
      <ul className="space-y-2">
        {series
          .filter((item) => item.count)
          .map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-xs text-anthracite/70"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
              {item.label}
              <span className="ml-auto pl-3 font-semibold">{item.count}</span>
            </li>
          ))}
        {!total && (
          <li className="text-xs text-anthracite/60">
            Aucune donnée disponible
          </li>
        )}
      </ul>
    </div>
  );
}

export function DistributionBars({ series }: { series: Series }) {
  const total = series.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="space-y-3">
      {series.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-anthracite/70">
            {item.label}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ivory">
            <div
              className="h-full rounded-full"
              style={{
                background: item.color,
                width: total ? (item.count / total) * 100 + "%" : "0%",
              }}
            />
          </div>
          <span className="min-w-5 text-right text-xs font-semibold text-anthracite">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}
