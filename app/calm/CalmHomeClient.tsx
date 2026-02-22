"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/src/AppContext";
import type { DoorType } from "@/lib/types";

const DOORS: { door: DoorType; label: string; emoji: string }[] = [
  { door: "doctor", label: "Doctor", emoji: "🩺" },
  { door: "bank", label: "Bank", emoji: "🏦" },
  { door: "pharmacy", label: "Pharmacy", emoji: "💊" },
  { door: "insurance", label: "Insurance", emoji: "🛡️" },
  { door: "utility", label: "Utility / Bills", emoji: "⚡" },
];

export default function CalmHomeClient() {
  const router = useRouter();
  const { theme, setSelectedDoor } = useAppContext();

  const primary = theme?.primaryColor ?? "#7C3AED";
  const text = theme?.textColor ?? "#1F2937";
  const greeting = theme?.greeting ?? "Hi! I'm CallPal, here to help 🌿";

  const handleTileTap = (door: DoorType) => {
    setSelectedDoor(door);
    router.push("/calm/input");
  };

  return (
    <main className="px-6 pt-8 sm:px-8 sm:pt-10">
      <h1
        className="mb-2 text-2xl font-semibold leading-tight sm:text-3xl"
        style={{ color: text }}
      >
        {greeting}
      </h1>
      <p
        className="mb-8 text-base opacity-80"
        style={{ color: text }}
      >
        What do you need help with today?
      </p>

      <div className="grid grid-cols-2 gap-4">
        {DOORS.slice(0, 4).map(({ door, label, emoji }) => (
          <button
            key={door}
            type="button"
            onClick={() => handleTileTap(door)}
            className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white px-4 py-5 transition active:scale-[0.98]"
            style={{ borderColor: primary }}
          >
            <span className="text-3xl" role="img" aria-hidden>
              {emoji}
            </span>
            <span className="text-base font-medium" style={{ color: text }}>
              {label}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleTileTap(DOORS[4].door)}
          className="col-span-2 flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white px-4 py-5 transition active:scale-[0.98]"
          style={{ borderColor: primary }}
        >
          <span className="text-3xl" role="img" aria-hidden>
            {DOORS[4].emoji}
          </span>
          <span className="text-base font-medium" style={{ color: text }}>
            {DOORS[4].label}
          </span>
        </button>
      </div>
    </main>
  );
}
