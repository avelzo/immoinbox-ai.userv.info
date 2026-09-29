"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StatusSelect({
  endpoint,
  initialStatus,
  label,
  options,
}: {
  endpoint: string;
  initialStatus: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function update(nextStatus: string) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Mise à jour impossible");
      setStatus(nextStatus);
      router.refresh();
    } catch {
      setError("Impossible de modifier le statut. Réessayez.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <select
        aria-label={label}
        aria-busy={loading}
        value={status}
        disabled={loading}
        onChange={(event) => update(event.target.value)}
        className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-anthracite/80 disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && (
        <span role="status" className="ml-2 text-xs text-forest">
          Enregistrement…
        </span>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
