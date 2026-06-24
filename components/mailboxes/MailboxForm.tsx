"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";

export function MailboxForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setLoading(true);

    const formData = new FormData(form);

    const payload = {
      email: String(formData.get("email") ?? ""),
      provider: String(formData.get("provider") ?? "imap"),
      imapHost: String(formData.get("imapHost") ?? ""),
      imapPort: Number(formData.get("imapPort") ?? 993),
      imapSecure: formData.get("imapSecure") === "on",
      imapUsername: String(formData.get("imapUsername") ?? ""),
      imapPassword: String(formData.get("imapPassword") ?? ""),
    };

    try {
      const response = await fetch("/api/mailboxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Impossible d'ajouter la boîte mail");
      }

      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l’ajout de la boîte mail.");
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
        icon={Plus}
        title="Ajouter une boîte mail"
        description="Renseignez les paramètres IMAP de la boîte à surveiller."
      />

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <input
          name="email"
          type="email"
          placeholder="Adresse email"
          required
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        <input
          name="provider"
          placeholder="Provider (ex: imap, ovh, gmail)"
          defaultValue="imap"
          required
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        <input
          name="imapHost"
          placeholder="Host IMAP (ex: ssl0.ovh.net)"
          required
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        <input
          name="imapPort"
          type="number"
          placeholder="Port"
          defaultValue={993}
          required
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        <input
          name="imapUsername"
          placeholder="Identifiant IMAP"
          required
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        <input
          name="imapPassword"
          type="password"
          placeholder="Mot de passe IMAP"
          required
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
          <input
            name="imapSecure"
            type="checkbox"
            defaultChecked
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
          />
          Connexion sécurisée SSL/TLS
        </label>
      </div>

      <div className="border-t border-slate-100 px-6 py-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Ajout..." : "Ajouter la boîte mail"}
        </button>
      </div>
    </form>
  );
}
