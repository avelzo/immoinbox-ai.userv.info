"use client";

import { useState } from "react";

type CopyN8nConfigButtonProps = {
  mailboxId: string;
  analyzeEndpoint: string;
  configEndpoint: string;
};

export function CopyN8nConfigButton({
  mailboxId,
  analyzeEndpoint,
  configEndpoint,
}: CopyN8nConfigButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyConfig() {
    const text = `
Configuration n8n - Mailbox ${mailboxId}

1. Node Get Mailbox Config
Method: GET
URL: ${configEndpoint}
Header:
Authorization: Bearer VOTRE_SECRET_N8N

2. Node Send to ImmoInbox API
Method: POST
URL: ${analyzeEndpoint}
Header:
Authorization: Bearer VOTRE_SECRET_N8N
Content-Type: application/json

Body JSON Expression:
{{
  {
    organizationId: $("Get Mailbox Config").item.json.organizationId,
    mailboxId: $("Get Mailbox Config").item.json.id,
    subject: $json.subject,
    from: $json.from,
    to: [$("Get Mailbox Config").item.json.email],
    content: $json.content,
    externalMessageId: $json.externalMessageId
  }
}}
`.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={copyConfig}
      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      {copied ? "Copié !" : "Copier config n8n"}
    </button>
  );
}