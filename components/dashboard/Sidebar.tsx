import Link from "next/link";

const navigation = [
  {
    label: "Emails",
    href: "/dashboard/emails",
  },
  {
    label: "Interventions",
    href: "/dashboard/interventions",
  },
  {
    label: "Statistiques",
    href: "/dashboard/stats",
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white px-4 py-6 md:block">
      <div className="mb-8 px-2">
        <Link href="/dashboard/emails" className="text-xl font-bold text-slate-900">
          ImmoInbox AI
        </Link>

        <p className="mt-1 text-sm text-slate-500">
          Assistant emails immobilier
        </p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}