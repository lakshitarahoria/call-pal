"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { getTranscript } from "@/src/api";
import type { DoorType, Intent, TranscriptLine } from "@/lib/types";

const BG = "#0F172A";
const ACCENT = "#3B82F6";
const MUTED = "#94A3B8";
const GREEN = "#22C55E";

const POLL_INTERVAL_MS = 4000;
const DONE_AFTER_LINES_MS = 15000;

const DOOR_EMOJI: Record<DoorType, string> = {
  doctor: "🩺",
  bank: "🏦",
  pharmacy: "💊",
  insurance: "🛡️",
  utility: "⚡",
};

interface TranscriptResponse {
  lines?: TranscriptLine[];
  error?: string;
}

type Status = "calling" | "connected" | "done";

export default function PowerCallingClient() {
  const router = useRouter();
  const { currentIntent, currentCallId, setCurrentIntent, setCurrentCallId, setSelectedDoor } = useAppContext();
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [status, setStatus] = useState<Status>("calling");
  const firstLineAtRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const intent = currentIntent as Intent | null;

  useEffect(() => {
    if (!currentCallId || !intent) {
      router.replace("/power");
      return;
    }
  }, [currentCallId, intent, router]);

  useEffect(() => {
    if (!currentCallId) return;

    const poll = async () => {
      try {
        const data = await getTranscript(currentCallId) as TranscriptResponse;
        if (data?.error || !Array.isArray(data?.lines)) return;
        const newLines = data.lines.filter((l) => l?.text?.trim());
        if (newLines.length > 0) {
          setLines(newLines);
          if (firstLineAtRef.current === null) firstLineAtRef.current = Date.now();
        }
      } catch {
        // keep polling
      }
    };

    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => clearInterval(intervalId);
  }, [currentCallId]);

  useEffect(() => {
    if (lines.length === 0) return;
    if (status === "calling") setStatus("connected");
  }, [lines.length, status]);

  useEffect(() => {
    if (status !== "connected" || firstLineAtRef.current === null) return;
    const t = setTimeout(() => setStatus("done"), DONE_AFTER_LINES_MS);
    return () => clearTimeout(t);
  }, [status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const handleNewCall = () => {
    setCurrentIntent(null);
    setCurrentCallId(null);
    setSelectedDoor(null);
    router.push("/power");
  };

  if (!currentCallId || !intent) {
    return null;
  }

  const door = intent.door as DoorType;
  const emoji = DOOR_EMOJI[door] ?? "⚡";
  const providerName = intent.provider_name ?? "Provider";

  return (
    <div
      className="flex min-h-screen flex-col px-4 pb-8 pt-5 sm:px-6"
      style={{ backgroundColor: BG }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          {emoji}
        </span>
        <span className="text-base font-medium text-white">
          {providerName}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        {status === "calling" && (
          <>
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: ACCENT, animation: "power-dot-pulse 1.2s ease-in-out infinite" }}
            />
            <span style={{ color: MUTED }}>Calling...</span>
          </>
        )}
        {status === "connected" && (
          <>
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: GREEN }}
            />
            <span style={{ color: MUTED }}>Connected</span>
          </>
        )}
        {status === "done" && (
          <>
            <span className="text-base" aria-hidden style={{ color: ACCENT }}>
              ✓
            </span>
            <span style={{ color: ACCENT }}>Done.</span>
          </>
        )}
      </div>

      <div
        ref={scrollRef}
        className="mt-4 flex-1 overflow-y-auto font-mono text-sm leading-relaxed"
        style={{ minHeight: "12rem" }}
      >
        {lines.length === 0 && (
          <p style={{ color: MUTED }}>Waiting for transcript...</p>
        )}
        {lines.map((line, i) => (
          <div
            key={i}
            className={line.speaker === "agent" ? "text-right" : "text-left"}
          >
            <span
              style={{
                color: line.speaker === "agent" ? ACCENT : MUTED,
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleNewCall}
        className="mt-6 w-full rounded-xl py-3 text-base font-medium text-white"
        style={{ backgroundColor: ACCENT }}
      >
        New call
      </button>
    </div>
  );
}
