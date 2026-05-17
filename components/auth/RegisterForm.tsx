"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("Laurent Hunaut");
  const [email, setEmail] = useState("admin@userv.info");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    console.log("Registering user:", { name, email });
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        alert(result.error.message ?? "Inscription impossible");
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
        Créer un compte
      </h1>

      <div className="mt-6 space-y-4 text-slate-800 placeholder:text-slate-400">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          className="w-full rounded-xl border px-4 py-2 text-sm"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border px-4 py-2 text-sm"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full rounded-xl border px-4 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer le compte"}
        </button>
      </div>
    </form>
  );
}