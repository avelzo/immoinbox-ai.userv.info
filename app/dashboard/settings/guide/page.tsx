import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Server,
  Workflow,
} from "lucide-react";

const steps = [
  {
    title: "1. Récupérer vos identifiants",
    content:
      "Dans l'onglet Agence et Boîtes mail des paramètres, notez votre organizationId et le mailboxId de la boîte à surveiller.",
  },
  {
    title: "2. Démarrer n8n",
    content:
      "Lancez la stack Docker (docker compose up -d). n8n est accessible sur http://localhost:5678.",
  },
  {
    title: "3. Créer le workflow",
    content:
      "Importez le workflow ImmoInbox (2 nodes : Trigger IMAP + HTTP Request POST vers /api/analyze-email). Utilisez le bouton « Copier config n8n » sur chaque boîte mail pour obtenir le JSON prêt à l'emploi.",
  },
  {
    title: "4. Configurer l'authentification",
    content:
      "Dans le node HTTP Request, ajoutez le header Authorization avec l'expression Bearer + N8N_WEBHOOK_SECRET (variable d'environnement n8n).",
  },
  {
    title: "5. Tester",
    content:
      "Depuis l'onglet Boîtes mail, cliquez sur « Tester » pour vérifier la connexion IMAP. Envoyez un email test et vérifiez qu'il apparaît dans le dashboard Emails.",
  },
];

export default function SettingsGuidePage() {
  return (
    <main className="p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux paramètres
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Guide d&apos;installation n8n
          </h1>

          <p className="mt-2 text-slate-600">
            Connectez votre workflow n8n pour analyser automatiquement les
            emails entrants.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-indigo-50/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Workflow className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Workflow en 2 étapes
                </p>

                <p className="text-sm text-slate-600">
                  Trigger IMAP → Envoi à l&apos;API ImmoInbox
                </p>
              </div>
            </div>
          </div>

          <ol className="divide-y divide-slate-100">
            {steps.map((step) => (
              <li key={step.title} className="px-6 py-5">
                <p className="font-medium text-slate-900">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {step.content}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600">
              <Server className="h-4 w-4" />
              <p className="text-sm font-semibold">URLs utiles</p>
            </div>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <span className="text-slate-500">App :</span>{" "}
                http://localhost:3000
              </li>
              <li>
                <span className="text-slate-500">n8n :</span>{" "}
                http://localhost:5678
              </li>
              <li>
                <span className="text-slate-500">API (depuis n8n) :</span>{" "}
                http://app:3000
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm font-semibold">Astuce</p>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Utilisez le bouton « Copier config n8n » sur chaque boîte mail
              dans les paramètres — il génère le body JSON et les headers
              exacts à coller dans n8n.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <div className="flex items-start gap-3">
            <Copy className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

            <div>
              <p className="text-sm font-medium text-indigo-950">
                Documentation technique complète
              </p>

              <p className="mt-1 text-sm text-indigo-900/80">
                Le fichier{" "}
                <code className="rounded bg-white/60 px-1.5 py-0.5 font-mono text-xs">
                  docs/N8N_SETUP.md
                </code>{" "}
                contient le détail complet (expressions n8n, pièges courants,
                commandes Docker). Disponible pour votre installateur ou
                intégrateur.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Retour aux paramètres
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
