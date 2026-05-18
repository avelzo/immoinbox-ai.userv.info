"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteMailboxButton({
  mailboxId,
}: {
  mailboxId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteMailbox() {
    const confirmed = confirm(
      "Supprimer cette boîte mail ? Les emails déjà analysés resteront enregistrés."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/mailboxes/${mailboxId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Suppression impossible");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Impossible de supprimer cette boîte mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteMailbox}
      disabled={loading}
      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}