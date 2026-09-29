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
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
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
            className="text-sm font-medium text-anthracite/80"
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
            className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 text-sm text-anthracite/80 placeholder:text-anthracite/45 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />

          <p className="mt-2 text-xs text-anthracite/60">
            Sans adresse renseignée, l&apos;email est enregistré mais
            l&apos;intervention reste à créer manuellement.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
