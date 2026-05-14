import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard/emails" className="text-lg font-bold">
            ImmoInbox AI
          </Link>

          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard/emails" className="text-slate-700 hover:text-black">
              Emails
            </Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}