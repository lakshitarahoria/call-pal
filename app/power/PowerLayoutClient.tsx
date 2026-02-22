"use client";

import { usePathname } from "next/navigation";
import PowerNav from "./PowerNav";

const BG = "#0F172A";

export default function PowerLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = pathname === "/power/calling";
  const isSettings = pathname === "/power/settings";

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: isSettings ? "#FFFFFF" : BG }}
    >
      <div className={hideNav ? "flex-1" : "flex-1 pb-24"}>{children}</div>
      {!hideNav && <PowerNav />}
    </div>
  );
}
