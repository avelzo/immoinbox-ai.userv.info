import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth-server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserMenu } from "@/components/layout/UserMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <div className="flex items-center justify-end px-6 py-4">
            <UserMenu email={session.user.email} />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}