import Link from "next/link";
import type { Email, Intervention } from "@prisma/client";
import {
  getCategoryLabel,
  getCategoryClass,
  getStatusLabel,
  getStatusClass,
  getUrgencyLabel,
} from "@/lib/email-ui";

export function EmailListRow({
  email,
  formattedReceivedAt,
}: {
  email: Email & { interventions: Intervention[] };
  formattedReceivedAt: string;
}) {
  const urgent = (email.urgency ?? 0) >= 4;
  const isNew = email.status === "NEW";
  return (
    <Link
      href={`/dashboard/emails/${email.id}`}
      className={`group grid grid-cols-2 gap-x-3 gap-y-2 px-4 py-3.5 transition-colors hover:bg-sage/30 sm:px-6 xl:grid-cols-[180px_minmax(0,1fr)_115px_85px_85px_85px] xl:items-center ${urgent && isNew ? "bg-red-50/40" : "bg-white"}`}
    >
      <div className="col-span-2 flex min-w-0 items-center gap-2 xl:col-span-1">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${isNew ? "bg-forest" : "bg-transparent"}`}
        />
        <span
          className={`truncate text-xs ${isNew ? "font-semibold text-anthracite" : "text-anthracite/70"}`}
        >
          {email.from}
        </span>
      </div>
      <div className="col-span-2 min-w-0 xl:col-span-1">
        <h2
          className={`truncate text-sm ${isNew ? "font-semibold text-anthracite" : "font-medium text-anthracite/80"}`}
        >
          {email.subject}
        </h2>
        <p className="mt-0.5 truncate text-xs text-anthracite/60">
          {email.summary ?? "Analyse en attente"}
        </p>
      </div>
      <span
        className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-medium ${getCategoryClass(email.category)}`}
      >
        {getCategoryLabel(email.category)}
      </span>
      <span
        className={`flex items-center gap-1.5 text-[11px] font-medium ${urgent ? "text-red-600" : "text-anthracite/60"}`}
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${urgent ? "bg-red-500" : email.urgency === 3 ? "bg-amber-500" : "bg-sage-dark"}`}
        />
        {getUrgencyLabel(email.urgency)}
      </span>
      <span
        className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-medium ${getStatusClass(email.status)}`}
      >
        {getStatusLabel(email.status)}
      </span>
      <time
        dateTime={email.receivedAt.toISOString()}
        className="text-[11px] text-anthracite/50 xl:text-right"
      >
        {formattedReceivedAt}
      </time>
    </Link>
  );
}
