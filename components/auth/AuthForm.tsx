"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = register
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Impossible de continuer. Réessayez.");
        return;
      }
      router.push("/dashboard/emails");
      router.refresh();
    } catch {
      setError("Connexion au serveur impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }
  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-anthracite placeholder:text-anthracite/40";
  return (
    <div className="flex min-h-dvh w-full flex-col bg-ivory">
      <header className="px-6 py-4">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-sm text-anthracite/60 hover:text-forest"
        >
          <ArrowLeft size={13} />
          Retour
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex justify-center">
            <LogoMark size={28} />
          </div>
          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h1 className="mb-1 text-base font-semibold text-anthracite">
              {register ? "Créer un compte" : "Connexion"}
            </h1>
            <p className="mb-5 text-sm text-anthracite/60">
              {register
                ? "Démarrez avec ImmoInbox AI"
                : "Accédez à votre espace de gestion"}
            </p>
            <form onSubmit={submit} className="space-y-3">
              {register && (
                <div>
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-anthracite/70"
                  >
                    Nom complet
                  </label>
                  <input
                    id="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    required
                    className={inputClass}
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-anthracite/70"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@agence.fr"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-anthracite/70"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={register ? 8 : undefined}
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 pt-1 text-anthracite/50"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-2 text-xs text-red-700"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-hover disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {loading
                  ? register
                    ? "Création en cours…"
                    : "Connexion…"
                  : register
                    ? "Créer le compte"
                    : "Se connecter"}
              </button>
            </form>
            <p className="mt-4 border-t border-line pt-4 text-center text-xs text-anthracite/60">
              {register ? "Déjà un compte ? " : "Pas encore de compte ? "}
              <Link
                href={register ? "/login" : "/register"}
                className="font-semibold text-forest hover:underline"
              >
                {register ? "Se connecter" : "Créer un compte"}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
