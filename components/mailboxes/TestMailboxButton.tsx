"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TestMailboxButton({
  mailboxId,
}: {
  mailboxId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function testMailbox() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/mailboxes/${mailboxId}/test`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Connexion impossible");

        router.refresh();
        return;
      }

      alert(
        `Connexion réussie.\nMessages: ${data.status.messages}\nNon lus: ${data.status.unseen}`
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Erreur lors du test de connexion.");

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={testMailbox}
      disabled={loading}
      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
    >
      {loading ? "Test..." : "Tester"}
    </button>
  );
}