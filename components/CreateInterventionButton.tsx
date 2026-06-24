"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateInterventionButton({
  emailId,
  size = "default",
}: {
  emailId: string;
  size?: "default" | "sm";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createIntervention() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/emails/${emailId}/create-intervention`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Erreur création intervention");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Impossible de créer l’intervention.");
    } finally {
      setLoading(false);
    }
  }

  const className =
    size === "sm"
      ? "rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 ring-1 ring-cyan-200/80 transition hover:bg-cyan-100 disabled:opacity-50"
      : "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50";

  return (
    <button
      type="button"
      onClick={createIntervention}
      disabled={loading}
      className={className}
    >
      {loading ? "Création..." : "Créer intervention"}
    </button>
  );
}