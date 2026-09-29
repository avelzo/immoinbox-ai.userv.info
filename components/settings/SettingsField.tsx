type SettingsFieldProps = {
  label: string;
  value: string;
  mono?: boolean;
  readOnly?: boolean;
};

export function SettingsField({
  label,
  value,
  mono = false,
  readOnly = false,
}: SettingsFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-anthracite/80">{label}</p>

        {readOnly && (
          <span className="rounded-md bg-sage/30 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-anthracite/60">
            Lecture seule
          </span>
        )}
      </div>

      <p
        className={
          mono
            ? "mt-2 break-all rounded-xl bg-ivory px-3 py-2.5 font-mono text-sm text-anthracite/80 ring-1 ring-slate-200/80"
            : "mt-2 text-sm font-medium text-anthracite"
        }
      >
        {value}
      </p>
    </div>
  );
}
