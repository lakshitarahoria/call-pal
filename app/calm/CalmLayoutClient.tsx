"use client";

import { usePathname } from "next/navigation";
import { useAppContext } from "@/src/AppContext";
import CalmNav from "./CalmNav";

export default function CalmLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme } = useAppContext();
  const isSettings = pathname?.includes("/settings");
  const bg = isSettings ? "#FFFFFF" : (theme?.backgroundColor ?? "#FFFFFF");
  const hideNav = pathname === "/calm/calling";

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: bg }}
    >
      <div className={hideNav ? "flex-1" : "flex-1 pb-24"}>{children}</div>
      {!hideNav && <CalmNav />}
    </div>
  );
}
