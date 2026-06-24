"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Email, EmailStatus, Intervention } from "@prisma/client";
import { EmailStatusButton } from "@/components/EmailStatusButton";
import { CreateInterventionButton } from "@/components/CreateInterventionButton";
import {
  getCategoryLabel,
  getCategoryClass,
  getUrgencyLabel,
  getUrgencyClass,
  getStatusLabel,
  getStatusClass,
} from "@/lib/email-ui";

type EmailListRowProps = {
  email: Email & {
    interventions: Intervention[];
  };
  formattedReceivedAt: string;
};

function stopRowNavigation(event: React.MouseEvent) {
  event.stopPropagation();
}

export function EmailListRow({
  email,
  formattedReceivedAt,
}: EmailListRowProps) {
  const router = useRouter();
  const isProcessed = email.status === "PROCESSED";

  return (
    <article
      onClick={() => router.push(`/dashboard/emails/${email.id}`)}
      className={`group cursor-pointer rounded-xl border bg-white px-4 py-4 shadow-sm transition sm:px-5 ${
        isProcessed
          ? "border-slate-200/80 bg-slate-50/50 hover:border-slate-300 hover:shadow-md"
          : "border-slate-200/80 hover:border-indigo-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <time>{formattedReceivedAt}</time>
            <span aria-hidden="true">·</span>
            <span className="truncate">{email.from}</span>
          </div>

          <h3
            className={`mt-1.5 font-semibold leading-snug text-slate-900 ${
              isProcessed ? "opacity-80" : ""
            }`}
          >
            {email.subject}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {email.summary ?? "Aucun résumé"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryClass(
                email.category
              )}`}
            >
              {getCategoryLabel(email.category)}
            </span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getUrgencyClass(
                email.urgency
              )}`}
            >
              {getUrgencyLabel(email.urgency)}
            </span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                email.status
              )}`}
            >
              {getStatusLabel(email.status)}
            </span>
          </div>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-indigo-400" />
      </div>

      <div
        className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"
        onClick={stopRowNavigation}
      >
        {email.interventions.length > 0 ? (
          <Link
            href={`/dashboard/interventions/${email.interventions[0].id}`}
            className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 ring-1 ring-cyan-200/80 transition hover:bg-cyan-100"
          >
            Voir intervention
          </Link>
        ) : email.category === "INCIDENT" ? (
          <CreateInterventionButton emailId={email.id} size="sm" />
        ) : null}

        <EmailStatusButton
          emailId={email.id}
          initialStatus={email.status as EmailStatus}
        />
      </div>
    </article>
  );
}
