"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { extractIntent } from "@/src/api";
import type { DoorType } from "@/lib/types";

const DOOR_INFO: Record<
  DoorType,
  { label: string; emoji: string; placeholder: string }
> = {
  doctor: {
    label: "Doctor",
    emoji: "🩺",
    placeholder: "e.g. My back has been hurting for a few days...",
  },
  bank: {
    label: "Bank",
    emoji: "🏦",
    placeholder: "e.g. There's a charge I don't recognise...",
  },
  pharmacy: {
    label: "Pharmacy",
    emoji: "💊",
    placeholder: "e.g. I need to refill my metformin...",
  },
  insurance: {
    label: "Insurance",
    emoji: "🛡️",
    placeholder: "e.g. I want to check what's covered...",
  },
  utility: {
    label: "Utility / Bills",
    emoji: "⚡",
    placeholder: "e.g. There's an extra charge on my bill...",
  },
};

export default function CalmInputClient() {
  const router = useRouter();
  const { theme, selectedDoor, setCurrentIntent } = useAppContext();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const doorInfo = selectedDoor ? DOOR_INFO[selectedDoor] : null;
  const primary = theme?.primaryColor ?? "#7C3AED";
  const text = theme?.textColor ?? "#1F2937";
  const callButtonText = theme?.callButtonText ?? "Let CallPal handle it";

  useEffect(() => {
    if (!selectedDoor) {
      router.replace("/calm");
    }
  }, [selectedDoor, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = message.trim();
    if (!value || loading || !selectedDoor) return;
    setLoading(true);
    try {
      const intent = await extractIntent(value, "calm");
      if (intent && !("error" in intent)) {
        setCurrentIntent(intent);
        router.push("/calm/confirm");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!selectedDoor) {
    return null;
  }

  const { label, emoji, placeholder } = DOOR_INFO[selectedDoor];

  return (
    <main className="flex min-h-full flex-col px-6 pt-6 sm:px-8 sm:pt-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/calm"
          className="flex items-center justify-center rounded-full p-2 transition hover:opacity-80"
          style={{ color: text }}
          aria-label="Back to home"
        >
          <span className="text-xl" aria-hidden>←</span>
        </Link>
        <span
          className="rounded-full px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: `${primary}20`,
            color: primary,
          }}
        >
          {emoji} {label}
        </span>
      </div>

      <h1
        className="mb-2 text-2xl font-semibold leading-tight sm:text-3xl"
        style={{ color: text }}
      >
        Tell me what&apos;s going on
      </h1>
      <p
        className="mb-6 text-base opacity-80"
        style={{ color: text }}
      >
        In your own words — no rush, take your time
      </p>

      {loading ? (
        <p
          className="py-8 text-center text-base"
          style={{ color: text, opacity: 0.8 }}
        >
          Reading what you wrote...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            rows={6}
            className="w-full resize-none rounded-2xl border-2 bg-white px-5 py-4 text-base placeholder:text-gray-400 focus:outline-none"
            style={{
              borderColor: "#E5E7EB",
              color: text,
              boxShadow: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = primary;
              e.target.style.boxShadow = `0 0 0 2px ${primary}40`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E7EB";
              e.target.style.boxShadow = "none";
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="w-full rounded-full py-3.5 text-base font-medium text-white transition disabled:opacity-50"
            style={{ backgroundColor: primary }}
          >
            {callButtonText}
          </button>
        </form>
      )}
    </main>
  );
}
