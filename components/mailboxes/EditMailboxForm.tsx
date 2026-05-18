"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type EditMailboxFormProps = {
  mailbox: {
    id: string;
    email: string;
    provider: string;
    imapHost: string | null;
    imapPort: number | null;
    imapSecure: boolean;
    imapUsername: string | null;
  };
};

export function EditMailboxForm({ mailbox }: EditMailboxFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);

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
      const response = await fetch(`/api/mailboxes/${mailbox.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Impossible de modifier la boîte mail");
      }

      router.push("/dashboard/settings");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification de la boîte mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Modifier la boîte mail
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 text-slate-800">
        <input
          name="email"
          type="email"
          defaultValue={mailbox.email}
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="provider"
          defaultValue={mailbox.provider}
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapHost"
          defaultValue={mailbox.imapHost ?? ""}
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapPort"
          type="number"
          defaultValue={mailbox.imapPort ?? 993}
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapUsername"
          defaultValue={mailbox.imapUsername ?? ""}
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapPassword"
          type="password"
          placeholder="Nouveau mot de passe IMAP (laisser vide pour conserver)"
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            name="imapSecure"
            type="checkbox"
            defaultChecked={mailbox.imapSecure}
          />
          Connexion sécurisée SSL/TLS
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "Modification..." : "Enregistrer"}
      </button>
    </form>
  );
}