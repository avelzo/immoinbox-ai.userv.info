"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        alert(result.error.message ?? "Connexion impossible");
        return;
      }

      router.push("/dashboard/emails");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
    >
      <h1 className="text-2xl font-bold text-slate-900">
        Connexion
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Accès au dashboard ImmoInbox AI.
      </p>

      <div className="mt-6 space-y-4 text-slate-800 placeholder:text-slate-400">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Mot de passe
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </form>
  );
}