import Link from "next/link";

const INCIDENT_EMAIL = process.env.INCIDENT_EMAIL || "";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
            Assistant IA pour agences immobilières
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Traitez vos emails locataires beaucoup plus vite.
          </h1>

          <p className="mt-6 text-xl leading-8 text-slate-300">
            ImmoInbox AI classe automatiquement les emails, détecte les urgences,
            résume les demandes et prépare des réponses professionnelles.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/dashboard/emails"
              className="rounded-xl bg-white px-6 py-3 font-medium text-slate-950 hover:bg-slate-200"
            >
              Voir la démo
            </Link>

            <a
              href="mailto:admin@userv.info"
              className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10"
            >
              Demander un essai pilote
            </a>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-3xl font-bold">-50%</p>
            <p className="mt-2 text-slate-300">
              de temps passé à trier les emails répétitifs.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-3xl font-bold">24/7</p>
            <p className="mt-2 text-slate-300">
              détection automatique des demandes urgentes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-3xl font-bold">IA</p>
            <p className="mt-2 text-slate-300">
              résumé, catégorisation et réponse suggérée.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold">
              Les emails immobiliers deviennent vite ingérables.
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Une petite agence reçoit chaque semaine des demandes locataires,
              incidents, candidatures, quittances, factures et relances. Le vrai
              problème n’est pas seulement le volume : c’est la perte de temps et
              le risque d’oublier une demande importante.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-6">
              <h3 className="font-semibold">Trop d’emails</h3>
              <p className="mt-2 text-slate-600">
                Les messages s’accumulent et les urgences se mélangent aux
                demandes simples.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-6">
              <h3 className="font-semibold">Trop de répétition</h3>
              <p className="mt-2 text-slate-600">
                Quittances, visites, badges, incidents : beaucoup de réponses
                se ressemblent.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-6">
              <h3 className="font-semibold">Trop de charge mentale</h3>
              <p className="mt-2 text-slate-600">
                Il faut lire, comprendre, classer, prioriser puis répondre sans
                rien oublier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-24 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold">
              L’IA lit, classe et prépare le travail.
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Chaque email reçu est analysé automatiquement. L’assistant détecte
              le type de demande, le niveau d’urgence, produit un résumé clair
              et propose une réponse prête à adapter.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Classification automatique des emails",
                "Détection des incidents urgents",
                "Résumé clair de la demande",
                "Action recommandée",
                "Réponse professionnelle suggérée",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-950" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Incident
              </span>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                Urgent
              </span>
            </div>

            <p className="text-sm text-slate-500">Email reçu</p>
            <p className="mt-2 rounded-xl bg-slate-100 p-4 text-slate-700">
              Bonjour, il y a une fuite importante sous l’évier de la cuisine
              depuis ce matin. L’eau coule sur le sol.
            </p>

            <p className="mt-6 text-sm text-slate-500">Résumé IA</p>
            <p className="mt-2 font-medium">
              Le locataire signale une fuite importante sous l’évier avec risque
              de dégâts.
            </p>

            <p className="mt-6 text-sm text-slate-500">Action recommandée</p>
            <p className="mt-2 font-medium">
              Contacter rapidement un plombier et confirmer la prise en charge.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold">
              Offre pilote pour petites agences.
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              L’objectif est simple : tester l’assistant sur quelques boîtes
              emails et mesurer le temps réellement gagné.
            </p>
          </div>

          <div className="mt-10 max-w-xl rounded-3xl border bg-slate-50 p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Offre pilote
            </p>

            <p className="mt-4 text-5xl font-bold">490€</p>
            <p className="mt-2 text-slate-600">
              installation et configuration initiale
            </p>

            <p className="mt-6 text-2xl font-semibold">+ 49€/mois</p>
            <p className="mt-2 text-slate-600">
              maintenance, ajustements et suivi
            </p>

            <ul className="mt-8 space-y-3 text-slate-700">
              <li>✓ Connexion boîte email</li>
              <li>✓ Dashboard emails analysés</li>
              <li>✓ Détection des urgences</li>
              <li>✓ Réponses suggérées</li>
              <li>✓ Ajustement des catégories métier</li>
            </ul>

            <a
              href={`mailto:${INCIDENT_EMAIL}`}
              className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-medium text-white hover:bg-slate-800"
            >
              Me contacter
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}