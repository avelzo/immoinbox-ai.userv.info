interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ImmoInbox AI"
    >
      {/* House roof */}
      <path
        d="M16 3L3 13h3v13h6v-7h8v7h6V13h3L16 3z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Envelope body (overlaid on house lower portion) */}
      <rect
        x="7"
        y="16"
        width="18"
        height="12"
        rx="2"
        fill="white"
        opacity="0.95"
      />
      {/* Envelope flap */}
      <path
        d="M7 17l9 7 9-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function LogoMark({
  size = 24,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{
          width: size + 8,
          height: size + 8,
          backgroundColor: light ? "rgba(255,255,255,0.15)" : "#143D36",
        }}
      >
        <Logo size={size} className={light ? "text-white" : "text-white"} />
      </div>
      <div>
        <div
          className={`font-semibold text-sm leading-tight tracking-tight ${light ? "text-white" : "text-[#202B28]"}`}
        >
          ImmoInbox
        </div>
        <div
          className={`text-[10px] font-medium tracking-widest uppercase ${light ? "text-[#DCE8E0]" : "text-[#143D36]"}`}
        >
          AI
        </div>
      </div>
    </div>
  );
}
