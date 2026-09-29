"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string | null }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  async function handleCopy() {
    if (!text) return;
    setError("");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copie impossible. Sélectionnez le texte pour le copier.");
    }
  }
  return (
    <div>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!text}
        className="flex items-center gap-1.5 rounded-xl border border-line bg-ivory px-3 py-1.5 text-xs font-medium text-anthracite/70 hover:border-sage-dark hover:text-forest disabled:opacity-50"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copié !" : "Copier la réponse"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
