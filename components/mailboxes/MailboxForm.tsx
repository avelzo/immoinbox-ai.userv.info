"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Ajouter une boîte mail
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 text-slate-800 placeholder:text-slate-400">
        <input
          name="email"
          type="email"
          placeholder="adresse email"
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="provider"
          placeholder="provider, ex: imap, ovh, gmail"
          defaultValue="imap"
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapHost"
          placeholder="host IMAP, ex: ssl0.ovh.net"
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapPort"
          type="number"
          placeholder="port"
          defaultValue={993}
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapUsername"
          placeholder="identifiant IMAP"
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <input
          name="imapPassword"
          type="password"
          placeholder="mot de passe IMAP"
          required
          className="rounded-xl border px-4 py-2 text-sm"
        />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            name="imapSecure"
            type="checkbox"
            defaultChecked
          />
          Connexion sécurisée SSL/TLS
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "Ajout..." : "Ajouter la boîte mail"}
      </button>
    </form>
  );
}