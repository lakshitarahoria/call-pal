"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { extractIntent, makeCall } from "@/src/api";
import type { DoorType } from "@/lib/types";

const ACCENT = "#3B82F6";
const BG = "#0F172A";
const CARD = "#1E293B";
const TEXT = "#FFFFFF";
const MUTED = "#94A3B8";

const DOORS: { door: DoorType; label: string; emoji: string; placeholder: string }[] = [
  { door: "doctor", label: "Doctor", emoji: "🩺", placeholder: "e.g. Book an appointment" },
  { door: "bank", label: "Bank", emoji: "🏦", placeholder: "e.g. Dispute a charge" },
  { door: "pharmacy", label: "Pharmacy", emoji: "💊", placeholder: "e.g. Refill prescription" },
  { door: "insurance", label: "Insurance", emoji: "🛡️", placeholder: "e.g. Check coverage" },
  { door: "utility", label: "Utility", emoji: "⚡", placeholder: "e.g. Query bill" },
];

const DEFAULT_PLACEHOLDER = "What do you need done?";

export default function PowerHomeClient() {
  const router = useRouter();
  const { setSelectedDoor, setCurrentIntent, setCurrentCallId } = useAppContext();
  const [message, setMessage] = useState("");
  const [selectedDoor, setSelectedDoorLocal] = useState<DoorType | null>(null);
  const [loading, setLoading] = useState(false);

  const placeholder =
    selectedDoor === null
      ? DEFAULT_PLACEHOLDER
      : DOORS.find((d) => d.door === selectedDoor)?.placeholder ?? DEFAULT_PLACEHOLDER;

  const handlePillTap = (door: DoorType) => {
    setSelectedDoor(door);
    setSelectedDoorLocal(door);
  };

  const handleGo = async () => {
    const value = message.trim();
    if (!value || loading) return;
    setLoading(true);
    try {
      const intent = await extractIntent(value, "power");
      if (!intent || "error" in intent) {
        setLoading(false);
        return;
      }
      setCurrentIntent(intent);
      const result = await makeCall(intent, "power") as { callId?: string };
      if (result?.callId) {
        setCurrentCallId(result.callId);
      }
      router.push("/power/calling");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: BG }}
    >
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: TEXT }}>
          CallPal
        </span>
        <Link
          href="/power/history"
          className="flex items-center justify-center p-2"
          style={{ color: MUTED }}
          aria-label="History"
        >
          <span className="text-lg" aria-hidden>🕐</span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col px-4 sm:px-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-xl border-2 px-4 py-3.5 text-lg text-white placeholder:text-slate-500 focus:outline-none"
            style={{
              backgroundColor: CARD,
              borderColor: "transparent",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = ACCENT;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "transparent";
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleGo}
            disabled={!message.trim() || loading}
            className="flex-shrink-0 rounded-xl px-5 py-3.5 text-lg font-medium text-white transition disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {loading ? "…" : "Go →"}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {DOORS.map(({ door, label, emoji }) => (
              <button
                key={door}
                type="button"
                onClick={() => handlePillTap(door)}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm transition"
                style={{
                  borderColor: selectedDoor === door ? ACCENT : CARD,
                  backgroundColor: selectedDoor === door ? `${ACCENT}20` : CARD,
                  color: TEXT,
                }}
              >
                <span aria-hidden>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
