"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCENT = "#3B82F6";

export default function PowerNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-slate-700 bg-[#0F172A] py-3 sm:py-4"
    >
      <Link
        href="/power"
        className="flex flex-col items-center gap-1 text-sm font-medium"
        style={{ color: pathname === "/power" ? ACCENT : "#94A3B8" }}
        aria-current={pathname === "/power" ? "page" : undefined}
      >
        <span aria-hidden>🏠</span>
        Home
      </Link>
      <Link
        href="/power/history"
        className="flex flex-col items-center gap-1 text-sm text-slate-400"
        style={{ color: pathname === "/power/history" ? ACCENT : undefined }}
        aria-current={pathname === "/power/history" ? "page" : undefined}
      >
        <span aria-hidden>📋</span>
        History
      </Link>
      <Link
        href="/power/settings"
        className="flex flex-col items-center gap-1 text-sm text-slate-400"
        style={{ color: pathname === "/power/settings" ? ACCENT : undefined }}
        aria-current={pathname === "/power/settings" ? "page" : undefined}
      >
        <span aria-hidden>⚙️</span>
        Settings
      </Link>
    </nav>
  );
}
