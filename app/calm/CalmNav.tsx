"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/src/AppContext";

export default function CalmNav() {
  const pathname = usePathname();
  const { theme } = useAppContext();
  const primary = theme?.primaryColor ?? "#7C3AED";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t bg-white/95 py-3 backdrop-blur sm:py-4"
      style={{ borderColor: `${primary}20` }}
    >
      <Link
        href="/calm"
        className="flex flex-col items-center gap-1 text-sm font-medium"
        style={{ color: pathname === "/calm" ? primary : undefined }}
        aria-current={pathname === "/calm" ? "page" : undefined}
      >
        <span aria-hidden>🏠</span>
        Home
      </Link>
      <Link
        href="/calm/history"
        className="flex flex-col items-center gap-1 text-sm text-zinc-500"
        style={{ color: pathname === "/calm/history" ? primary : undefined }}
        aria-current={pathname === "/calm/history" ? "page" : undefined}
      >
        <span aria-hidden>📋</span>
        History
      </Link>
      <Link
        href="/calm/settings"
        className="flex flex-col items-center gap-1 text-sm text-zinc-500"
        style={{ color: pathname === "/calm/settings" ? primary : undefined }}
        aria-current={pathname === "/calm/settings" ? "page" : undefined}
      >
        <span aria-hidden>⚙️</span>
        Settings
      </Link>
    </nav>
  );
}
