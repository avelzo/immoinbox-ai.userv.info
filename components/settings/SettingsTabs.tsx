"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Mail,
  Plug,
  User,
} from "lucide-react";
import { MailboxForm } from "@/components/mailboxes/MailboxForm";
import { TestMailboxButton } from "@/components/mailboxes/TestMailboxButton";
import { CopyN8nConfigButton } from "@/components/mailboxes/CopyN8nConfigButton";
import { DeleteMailboxButton } from "@/components/mailboxes/DeleteMailboxButton";
import { InterventionNotifyEmailForm } from "@/components/settings/InterventionNotifyEmailForm";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";

type SettingsMailbox = {
  id: string;
  email: string;
  provider: string;
  connectionStatus: string;
  imapHost: string | null;
  imapPort: number | null;
  imapUsername: string | null;
  lastTestedAt: string | null;
  lastError: string | null;
};

type SettingsTabsProps = {
  organization: {
    id: string;
    name: string;
    interventionNotifyEmail: string | null;
  };
  user: {
    email: string;
    name: string | null;
  };
  mailboxes: SettingsMailbox[];
  n8nApiBaseUrl: string;
};

const tabs = [
  {
    id: "agency",
    label: "Agence",
    icon: Building2,
  },
  {
    id: "mailboxes",
    label: "Boîtes mail",
    icon: Mail,
  },
  {
    id: "integrations",
    label: "Intégrations",
    icon: Plug,
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

function SettingsPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {children}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Jamais";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SettingsTabs({
  organization,
  user,
  mailboxes,
  n8nApiBaseUrl,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("agency");

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={
                  isActive
                    ? "flex items-center gap-2 border-b-2 border-indigo-600 px-4 py-3 text-sm font-medium text-indigo-600"
                    : "flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                }
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "agency" && (
        <div className="space-y-6">
          <SettingsPanel>
            <SettingsSectionHeader
              icon={Building2}
              title="Organisation"
              description="Informations de votre agence. Certains identifiants techniques sont affichés en lecture seule."
            />

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <SettingsField label="Nom de l'agence" value={organization.name} />

              <SettingsField
                label="ID organisation"
                value={organization.id}
                mono
                readOnly
              />
            </div>
          </SettingsPanel>

          <InterventionNotifyEmailForm
            initialEmail={organization.interventionNotifyEmail}
          />
        </div>
      )}

      {activeTab === "mailboxes" && (
        <div className="space-y-6">
          <SettingsPanel>
            <SettingsSectionHeader
              icon={Mail}
              title="Boîtes mail connectées"
              description="Surveillez l'état de vos connexions IMAP et testez-les à tout moment."
            />

            {mailboxes.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-slate-500">
                Aucune boîte mail connectée pour le moment.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {mailboxes.map((mailbox) => {
                  const isConnected = mailbox.connectionStatus === "CONNECTED";
                  const hasError = mailbox.connectionStatus === "ERROR";

                  return (
                    <div key={mailbox.id} className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900">
                              {mailbox.email}
                            </p>

                            {isConnected ? (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/80">
                                Connectée
                              </span>
                            ) : hasError ? (
                              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-200/80">
                                Erreur
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                Non testée
                              </span>
                            )}
                          </div>

                          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                              <dt className="text-slate-500">Provider</dt>
                              <dd className="mt-0.5 font-medium text-slate-800">
                                {mailbox.provider}
                              </dd>
                            </div>

                            <div>
                              <dt className="text-slate-500">IMAP</dt>
                              <dd className="mt-0.5 font-medium text-slate-800">
                                {mailbox.imapHost ?? "Non configuré"}:
                                {mailbox.imapPort ?? "—"}
                              </dd>
                            </div>

                            <div>
                              <dt className="text-slate-500">Utilisateur</dt>
                              <dd className="mt-0.5 font-medium text-slate-800">
                                {mailbox.imapUsername ?? "Non configuré"}
                              </dd>
                            </div>

                            <div>
                              <dt className="text-slate-500">Dernier test</dt>
                              <dd className="mt-0.5 font-medium text-slate-800">
                                {formatDate(mailbox.lastTestedAt)}
                              </dd>
                            </div>
                          </dl>

                          {mailbox.lastError && (
                            <div className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-100">
                              {mailbox.lastError}
                            </div>
                          )}

                          <details className="group mt-4">
                            <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-700">
                              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                              Configuration n8n pour cette boîte
                            </summary>

                            <div className="mt-3 space-y-2">
                              <code className="block break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 ring-1 ring-slate-200/80">
                                {n8nApiBaseUrl}/api/n8n/mailboxes/{mailbox.id}
                              </code>

                              <code className="block break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 ring-1 ring-slate-200/80">
                                {n8nApiBaseUrl}/api/analyze-email
                              </code>
                            </div>
                          </details>
                        </div>

                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <TestMailboxButton mailboxId={mailbox.id} />

                          <CopyN8nConfigButton
                            mailboxId={mailbox.id}
                            mailboxEmail={mailbox.email}
                            organizationId={organization.id}
                            configEndpoint={`${n8nApiBaseUrl}/api/n8n/mailboxes/${mailbox.id}`}
                            analyzeEndpoint={`${n8nApiBaseUrl}/api/analyze-email`}
                          />

                          <Link
                            href={`/dashboard/settings/mailboxes/${mailbox.id}`}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            Modifier
                          </Link>

                          <DeleteMailboxButton mailboxId={mailbox.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SettingsPanel>

          <MailboxForm />
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
            <p className="text-sm font-medium text-indigo-950">
              Besoin d&apos;aide pour connecter n8n ?
            </p>

            <p className="mt-1 text-sm text-indigo-900/80">
              Consultez le guide pas à pas pour configurer le workflow
              d&apos;analyse des emails.
            </p>

            <Link
              href="/dashboard/settings/guide"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              Ouvrir le guide d&apos;installation
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <SettingsPanel>
            <SettingsSectionHeader
              icon={Plug}
              title="Configuration n8n"
              description="Identifiants à utiliser dans votre workflow n8n."
              badge="Avancé"
            />

            <div className="space-y-5 p-6">
              <SettingsField
                label="Endpoint API"
                value={`${n8nApiBaseUrl}/api/analyze-email`}
                mono
                readOnly
              />

              <SettingsField
                label="organizationId"
                value={organization.id}
                mono
                readOnly
              />

              {mailboxes[0] && (
                <SettingsField
                  label="mailboxId principal"
                  value={mailboxes[0].id}
                  mono
                  readOnly
                />
              )}
            </div>
          </SettingsPanel>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 px-4 py-3 text-sm text-slate-500">
        <User className="h-4 w-4 shrink-0 text-slate-400" />

        <p>
          Connecté en tant que{" "}
          <span className="font-medium text-slate-700">{user.email}</span>
          {user.name ? (
            <>
              {" "}
              · <span>{user.name}</span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
