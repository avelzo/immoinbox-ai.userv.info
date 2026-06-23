"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

  return (
    <tr
      onClick={() => router.push(`/dashboard/emails/${email.id}`)}
      className={`cursor-pointer transition-colors hover:bg-slate-50 ${
        email.status === "PROCESSED" ? "bg-slate-50 opacity-70" : ""
      }`}
    >
      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
        {formattedReceivedAt}
      </td>

      <td className="px-4 py-3 text-slate-700">{email.from}</td>

      <td className="px-4 py-3">
        <span className="font-medium text-slate-900">{email.subject}</span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryClass(
            email.category
          )}`}
        >
          {getCategoryLabel(email.category)}
        </span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyClass(
            email.urgency
          )}`}
        >
          {getUrgencyLabel(email.urgency)}
        </span>
      </td>

      <td className="max-w-md px-4 py-3 text-slate-600">
        {email.summary ?? "Aucun résumé"}
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
            email.status
          )}`}
        >
          {getStatusLabel(email.status)}
        </span>
      </td>

      <td className="px-4 py-3" onClick={stopRowNavigation}>
        {email.interventions.length > 0 ? (
          <Link
            href={`/dashboard/interventions/${email.interventions[0].id}`}
            className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-200"
          >
            Voir intervention
          </Link>
        ) : email.category === "INCIDENT" ? (
          <CreateInterventionButton emailId={email.id} size="sm" />
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>

      <td className="px-4 py-3" onClick={stopRowNavigation}>
        <EmailStatusButton
          emailId={email.id}
          initialStatus={email.status as EmailStatus}
        />
      </td>
    </tr>
  );
}
