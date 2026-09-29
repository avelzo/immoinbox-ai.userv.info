"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar, type SidebarProps } from "./Sidebar";

export function DashboardShell({
  children,
  ...sidebar
}: SidebarProps & { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = drawer.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-ivory">
      <div className="hidden w-[220px] shrink-0 md:block lg:w-[240px]">
        <Sidebar {...sidebar} />
      </div>
      <dialog
        ref={drawer}
        aria-label="Navigation"
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === drawer.current) setOpen(false);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-black/40"
      >
        <div className="relative h-full w-64">
          <button
            autoFocus
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="absolute right-2 top-4 z-10 rounded-lg p-2 text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
          <Sidebar {...sidebar} onNavigate={() => setOpen(false)} />
        </div>
      </dialog>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="rounded-lg p-2 text-anthracite hover:bg-ivory"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold">ImmoInbox AI</span>
        </header>
        <div key={pathname} className="min-w-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
