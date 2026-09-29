"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function UserMenu({ email }: { email: string }) {
  const router = useRouter();

  const initial = email.charAt(0).toUpperCase();

  async function logout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">
        {initial}
      </div>

      <div className="hidden text-right sm:block">
        <p className="max-w-48 truncate text-sm font-medium text-anthracite">
          {email}
        </p>

        <p className="text-xs text-anthracite/60">Connecté</p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-anthracite/80 hover:bg-sage/30"
      >
        Déconnexion
      </button>
    </div>
  );
}
