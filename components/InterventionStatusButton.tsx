"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getInterventionStatusLabel } from "@/lib/intervention-ui";

type InterventionStatus =
  | "PENDING"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED";

const statusOrder: InterventionStatus[] = [
  "PENDING",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
];

function getNextStatus(status: InterventionStatus): InterventionStatus {
  const index = statusOrder.indexOf(status);

  return statusOrder[Math.min(index + 1, statusOrder.length - 1)];
}

export function InterventionStatusButton({
  interventionId,
  initialStatus,
}: {
  interventionId: string;
  initialStatus: InterventionStatus;
}) {
  const router = useRouter();
  const [status, setStatus] =
    useState<InterventionStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const nextStatus = getNextStatus(status);
  const isCompleted = status === "COMPLETED";

  async function updateStatus() {
    if (isCompleted) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/interventions/${interventionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur mise à jour intervention");
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
      onClick={updateStatus}
      disabled={loading || isCompleted}
      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Mise à jour..."
        : isCompleted
        ? "Terminée"
        : `Passer à : ${getInterventionStatusLabel(nextStatus)}`}
    </button>
  );
}