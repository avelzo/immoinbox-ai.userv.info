"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { EMAIL_CATEGORIES } from "@/lib/email-categories";

export function InboxFilters({
  q,
  category,
  status,
  urgent,
  sort,
}: {
  q: string;
  category?: string;
  status?: string;
  urgent: boolean;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function update(key: string, value: string) {
    const params = new URLSearchParams({ q, sort });
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (urgent) params.set("urgent", "true");
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() =>
      router.push("/dashboard/emails?" + params.toString()),
    );
  }
  const field =
    "rounded-xl border border-line bg-ivory px-3 py-2 text-xs text-anthracite";
  return (
    <div aria-busy={pending} className={pending ? "opacity-60" : ""}>
      <div className="flex flex-wrap items-center gap-2">
        <form
          action="/dashboard/emails"
          className="relative flex min-w-0 basis-full gap-2 sm:flex-1 sm:basis-auto"
        >
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-3 text-anthracite/40"
          />
          <input
            aria-label="Rechercher les emails"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher un expéditeur, objet, résumé…"
            className="w-full rounded-xl border border-line bg-ivory py-2 pl-8 pr-3 text-sm text-anthracite placeholder:text-anthracite/45"
          />
          {category && <input type="hidden" name="category" value={category} />}
          {status && <input type="hidden" name="status" value={status} />}
          {urgent && <input type="hidden" name="urgent" value="true" />}
          <input type="hidden" name="sort" value={sort} />
          <button className="rounded-xl border border-line px-3 py-2 text-xs font-medium text-forest hover:bg-sage/30">
            Rechercher
          </button>
        </form>
        <label className="flex items-center gap-1.5">
          <ArrowUpDown size={13} className="text-anthracite/60" />
          <select
            aria-label="Trier les emails"
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className={field}
          >
            <option value="recent">Plus récent</option>
            <option value="oldest">Plus ancien</option>
            <option value="urgent">Priorité</option>
            <option value="new">Statut</option>
          </select>
        </label>
      </div>
      <details
        open={Boolean(category || status || urgent)}
        className="group mt-3"
      >
        <summary className="flex w-fit list-none items-center gap-1.5 rounded-xl border border-line bg-ivory px-3 py-2 text-xs font-medium text-anthracite/70">
          <Filter size={13} />
          Filtres
          <ChevronDown size={12} className="group-open:rotate-180" />
        </summary>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3">
          <select
            aria-label="Catégorie"
            className={field}
            value={category ?? ""}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {Object.entries(EMAIL_CATEGORIES).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Statut"
            className={field}
            value={status ?? ""}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="NEW">Nouveau</option>
            <option value="PROCESSED">Traité</option>
            <option value="ARCHIVED">Archivé</option>
            <option value="ERROR">Erreur</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-anthracite/70">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => update("urgent", e.target.checked ? "true" : "")}
              className="accent-forest"
            />
            Urgences uniquement
          </label>
          {(q || status || category || urgent) && (
            <button
              type="button"
              className="text-xs font-medium text-forest hover:underline"
              onClick={() =>
                startTransition(() => router.push("/dashboard/emails"))
              }
            >
              Réinitialiser
            </button>
          )}
        </div>
      </details>
    </div>
  );
}
