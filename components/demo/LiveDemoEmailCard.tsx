"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

type LiveDemoEmailCardProps = {
  label: string;
  subject: string;
  body: string;
  expected: string;
};

export function LiveDemoEmailCard({
  label,
  subject,
  body,
  expected,
}: LiveDemoEmailCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  async function copyText(field: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);

    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  }

  const fullEmail = `Subject: ${subject}\n\n${body}`;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-indigo-700">{expected}</p>
        </div>

        <button
          type="button"
          onClick={() => copyText("full", fullEmail)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
        >
          <Copy className="h-3.5 w-3.5" />
          {copiedField === "full" ? "Copié !" : "Copier l'email"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Objet
            </p>

            <button
              type="button"
              onClick={() => copyText("subject", subject)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              {copiedField === "subject" ? "Copié" : "Copier"}
            </button>
          </div>

          <p className="mt-1 text-sm font-medium text-slate-900">{subject}</p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Corps
            </p>

            <button
              type="button"
              onClick={() => copyText("body", body)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              {copiedField === "body" ? "Copié" : "Copier"}
            </button>
          </div>

          <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200/80">
            {body}
          </pre>
        </div>
      </div>
    </div>
  );
}
