"use client";

import { useState } from "react";

type CopyN8nConfigButtonProps = {
  mailboxId: string;
  mailboxEmail: string;
  organizationId: string;
  analyzeEndpoint: string;
  configEndpoint: string;
};

export function CopyN8nConfigButton({
  mailboxId,
  mailboxEmail,
  organizationId,
  analyzeEndpoint,
  configEndpoint,
}: CopyN8nConfigButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyConfig() {
    const text = `
Configuration n8n - Mailbox ${mailboxId}

Workflow : ImmoInbox - Analyse emails

Node 1 — Email Trigger (IMAP)
  Nom : Trigger IMAP - Boîte agence

Node 2 — HTTP Request
  Nom : Envoyer à ImmoInbox API
  Method: POST
  URL: ${analyzeEndpoint}
  Headers:
    Authorization (expression) : ={{ 'Bearer ' + $env.N8N_WEBHOOK_SECRET }}
    Content-Type: application/json
  Authentication: None
  Body Content Type: JSON
  Specify Body: Using JSON (mode Expression)

  JSON Body:
  {{
    {
      organizationId: '${organizationId}',
      mailboxId: '${mailboxId}',
      subject: $json.subject,
      from: $json.from?.text || $json.from,
      to: ['${mailboxEmail}'],
      content: $json.text || $json.html || $json.textHtml || '',
      externalMessageId: $json.messageId || $json.metadata?.['message-id'] || ''
    }
  }}

Endpoint config mailbox (optionnel) :
  GET ${configEndpoint}
  Header Authorization (expression): ={{ 'Bearer ' + $env.N8N_WEBHOOK_SECRET }}
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
