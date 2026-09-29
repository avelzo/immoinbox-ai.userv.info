import {
  ArrowRight,
  Mail,
  Bot,
  CheckCircle2,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      {/* Nav */}
      <header className="border-b border-[#e8ede9] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <LogoMark size={20} />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#202B28]/60 hover:text-[#143D36] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="mailto:admin@userv.info"
              className="px-4 py-2 bg-[#143D36] text-white text-sm font-medium rounded-xl hover:bg-[#1c5248] transition-colors"
            >
              Demander un essai
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DCE8E0] rounded-full text-xs font-semibold text-[#143D36] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#143D36]" />
            Gestion locative — outil professionnel
          </div>
          <h1 className="text-4xl font-bold text-[#202B28] leading-tight tracking-tight mb-5">
            La boîte mail de votre
            <br />
            agence,{" "}
            <span className="text-[#143D36]">organisée et priorisée</span> par
            l’IA
          </h1>
          <p className="text-base text-[#202B28]/60 leading-relaxed mb-8 max-w-xl">
            ImmoInbox centralise les emails de vos locataires, propriétaires et
            artisans. L’IA classe chaque demande, signale les urgences et vous
            aide à traiter les priorités en premier.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="mailto:admin@userv.info"
              className="flex items-center gap-2 px-5 py-3 bg-[#143D36] text-white text-sm font-semibold rounded-xl hover:bg-[#1c5248] transition-colors"
            >
              Demander un essai pilote
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard/demo"
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#202B28]/70 text-sm font-medium rounded-xl border border-[#e8ede9] hover:border-[#c4d8cc] transition-colors"
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* App preview */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="rounded-2xl border border-[#e8ede9] overflow-hidden shadow-xl shadow-[#143D36]/5">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F0F4F1] border-b border-[#e8ede9]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8ede9]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8ede9]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8ede9]" />
            </div>
            <span className="text-xs text-[#202B28]/35 mx-auto font-medium">
              ImmoInbox AI — aperçu de l’interface
            </span>
          </div>
          {/* Inbox preview */}
          <div className="bg-white flex">
            <div className="hidden w-44 bg-[#143D36] p-3 shrink-0 sm:block">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Mail size={12} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-white">
                  ImmoInbox AI
                </span>
              </div>
              {[
                "Boîte de réception",
                "Interventions",
                "Statistiques",
                "Paramètres",
              ].map((item, i) => (
                <div
                  key={item}
                  className={`px-2 py-1.5 rounded-lg mb-1 flex items-center justify-between ${i === 0 ? "bg-white/15" : ""}`}
                >
                  <span
                    className={`text-xs ${i === 0 ? "text-white font-medium" : "text-white/50"}`}
                  >
                    {item}
                  </span>
                  {i === 0 && (
                    <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 font-bold">
                      3
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="px-4 py-3 border-b border-[#F0F4F1]">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-semibold text-[#202B28]">
                    Boîte de réception
                  </span>
                  <div className="flex gap-3 ml-auto">
                    <span className="text-xs">
                      <strong className="text-[#143D36]">3</strong>{" "}
                      <span className="text-[#202B28]/40">nouveaux</span>
                    </span>
                    <span className="text-xs">
                      <strong className="text-red-600">2</strong>{" "}
                      <span className="text-[#202B28]/40">urgences</span>
                    </span>
                  </div>
                </div>
              </div>
              {[
                {
                  from: "Marie Dupont",
                  subject: "URGENT — Fuite eau sous évier cuisine",
                  urgency: 5,
                  cat: "Incident",
                  status: "Nouveau",
                  read: false,
                },
                {
                  from: "Jean-Claude Moreau",
                  subject: "Panne chauffage depuis 2 jours",
                  urgency: 4,
                  cat: "Incident",
                  status: "Nouveau",
                  read: false,
                },
                {
                  from: "Sophie Laurent",
                  subject: "Demande de quittance",
                  urgency: 2,
                  cat: "Quittance",
                  status: "Traité",
                  read: true,
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b border-[#F0F4F1] text-xs ${row.urgency >= 4 ? "bg-red-50/30" : "bg-white"}`}
                >
                  {!row.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#143D36] shrink-0" />
                  )}
                  {row.read && <span className="w-1.5 h-1.5 shrink-0" />}
                  <span
                    className={`hidden w-28 truncate shrink-0 sm:block ${!row.read ? "font-semibold text-[#202B28]" : "text-[#202B28]/60"}`}
                  >
                    {row.from}
                  </span>
                  <span
                    className={`flex-1 truncate ${!row.read ? "font-medium text-[#202B28]" : "text-[#202B28]/50"}`}
                  >
                    {row.subject}
                  </span>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      row.cat === "Incident"
                        ? "bg-red-50 text-red-600"
                        : "bg-teal-50 text-teal-600"
                    }`}
                  >
                    {row.cat}
                  </span>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      row.status === "Nouveau"
                        ? "bg-[#DCE8E0] text-[#143D36]"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-bold text-[#202B28] mb-8 text-center">
          Comment ça fonctionne
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              icon: Mail,
              title: "Connectez votre boîte mail",
              desc: "Reliez les boîtes professionnelles compatibles IMAP. ImmoInbox récupère les nouveaux emails automatiquement.",
            },
            {
              step: "02",
              icon: Bot,
              title: "L'IA analyse les demandes",
              desc: "Chaque email est classé par catégorie (incident, quittance, candidature…), un niveau d'urgence lui est attribué et un résumé est généré.",
            },
            {
              step: "03",
              icon: CheckCircle2,
              title: "Vous traitez les priorités",
              desc: "Repérez les urgences et filtrez les demandes prioritaires. Copiez la réponse suggérée, créez une intervention, changez le statut.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-[#e8ede9] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#DCE8E0] flex items-center justify-center">
                    <Icon size={15} className="text-[#143D36]" />
                  </div>
                  <span className="text-xs font-bold text-[#143D36]/50">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#202B28] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#202B28]/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              label: "Urgences immédiatement visibles",
              desc: "Plus besoin de parcourir toute la boîte mail pour trouver ce qui est urgent.",
            },
            {
              icon: Shield,
              label: "Accès à votre espace agence",
              desc: "Retrouvez les demandes et interventions de votre agence dans un espace dédié.",
            },
            {
              icon: Users,
              label: "Multi-boîtes, multi-gestionnaires",
              desc: "Centralisez les boîtes mail de votre agence dans un même espace de travail.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex gap-3 p-4 bg-white rounded-2xl border border-[#e8ede9]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F0F4F1] flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[#143D36]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#202B28] mb-1">
                    {f.label}
                  </p>
                  <p className="text-xs text-[#202B28]/50 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="bg-[#143D36] rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">
            Tester ImmoInbox avec votre agence
          </h2>
          <p className="text-sm text-white/60 mb-6 max-w-md mx-auto leading-relaxed">
            Nous proposons un essai pilote sur un périmètre limité pour vérifier
            l’adéquation avec votre flux d’emails.
          </p>
          <Link
            href="mailto:admin@userv.info"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#143D36] text-sm font-semibold rounded-xl hover:bg-[#F7F8F5] transition-colors"
          >
            Demander un essai pilote
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8ede9] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <LogoMark size={16} />
          <p className="text-xs text-[#202B28]/35">
            © {new Date().getFullYear()} ImmoInbox AI
          </p>
        </div>
      </footer>
    </div>
  );
}
