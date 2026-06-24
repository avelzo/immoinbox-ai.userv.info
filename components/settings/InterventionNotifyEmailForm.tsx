"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell } from "lucide-react";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";

type InterventionNotifyEmailFormProps = {
  initialEmail: string | null;
};

export function InterventionNotifyEmailForm({
  initialEmail,
}: InterventionNotifyEmailFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/organization/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interventionNotifyEmail: email.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible d'enregistrer l'email");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    >
      <SettingsSectionHeader
        icon={Bell}
        title="Contact interventions"
        description="Email notifié automatiquement lorsqu'un email incident ou urgent déclenche une intervention."
      />

      <div className="space-y-4 p-6">
        <div>
          <label
            htmlFor="interventionNotifyEmail"
            className="text-sm font-medium text-slate-700"
          >
            Email de notification
          </label>

          <input
            id="interventionNotifyEmail"
            name="interventionNotifyEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ex: admin@agence.fr"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <p className="mt-2 text-xs text-slate-500">
            Sans adresse renseignée, l&apos;email est enregistré mais
            l&apos;intervention reste à créer manuellement.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
