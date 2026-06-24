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
        <p className="text-sm font-medium text-slate-700">{label}</p>

        {readOnly && (
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Lecture seule
          </span>
        )}
      </div>

      <p
        className={
          mono
            ? "mt-2 break-all rounded-xl bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700 ring-1 ring-slate-200/80"
            : "mt-2 text-sm font-medium text-slate-900"
        }
      >
        {value}
      </p>
    </div>
  );
}
