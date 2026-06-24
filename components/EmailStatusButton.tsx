"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type EmailStatus = "NEW" | "PROCESSED" | "ARCHIVED" | "ERROR";

type EmailStatusButtonProps = {
  emailId: string;
  initialStatus: EmailStatus;
};

export function EmailStatusButton({
  emailId,
  initialStatus,
}: EmailStatusButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<EmailStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const isProcessed = status === "PROCESSED";
  const nextStatus: EmailStatus = isProcessed ? "NEW" : "PROCESSED";

  async function toggleStatus() {
    setLoading(true);

    try {
      const response = await fetch(`/api/emails/${emailId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ?? "Erreur lors de la mise à jour du statut"
        );
      }

      setStatus(nextStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Impossible de mettre à jour le statut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={loading}
      className={
        isProcessed
          ? "rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
          : "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      }
    >
      {loading ? "..." : isProcessed ? "Réouvrir" : "Traiter"}
    </button>
  );
}