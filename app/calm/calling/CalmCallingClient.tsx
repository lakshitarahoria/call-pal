"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { getTranscript } from "@/src/api";

const POLL_INTERVAL_MS = 5000;
const LONG_WAIT_MS = 3 * 60 * 1000; // 3 minutes

interface TranscriptResponse {
  lines?: { speaker: string; text: string }[];
  error?: string;
}

function hasTranscriptContent(data: TranscriptResponse): boolean {
  if (data?.error || !Array.isArray(data?.lines)) return false;
  return data.lines.some((line) => line?.text?.trim?.());
}

export default function CalmCallingClient() {
  const router = useRouter();
  const { theme, currentCallId } = useAppContext();
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
  const longWaitShownRef = useRef(false);

  const primary = theme?.primaryColor ?? "#7C3AED";
  const bg = theme?.backgroundColor ?? "#FFFFFF";
  const text = theme?.textColor ?? "#1F2937";
  const accentEmoji = theme?.accentEmoji ?? "💜";
  const waitingMessage = theme?.waitingMessage ?? "CallPal is on the phone for you.";

  useEffect(() => {
    if (!currentCallId) {
      router.replace("/calm");
      return;
    }
  }, [currentCallId, router]);

  useEffect(() => {
    if (!currentCallId) return;

    const poll = async () => {
      try {
        const data = await getTranscript(currentCallId) as TranscriptResponse;
        if (hasTranscriptContent(data)) {
          router.push("/calm/done");
          return;
        }
      } catch {
        // keep polling
      }
    };

    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    poll(); // first run immediately

    return () => clearInterval(intervalId);
  }, [currentCallId, router]);

  useEffect(() => {
    if (!currentCallId) return;

    const t = setTimeout(() => {
      if (!longWaitShownRef.current) {
        longWaitShownRef.current = true;
        setShowLongWaitMessage(true);
      }
    }, LONG_WAIT_MS);

    return () => clearTimeout(t);
  }, [currentCallId]);

  if (!currentCallId) {
    return null;
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: bg }}
    >
      <div className="relative flex h-44 w-44 flex-shrink-0 items-center justify-center">
        {/* Pulse rings */}
        <div
          className="absolute h-44 w-44 rounded-full"
          style={{
            border: `3px solid ${primary}`,
            animation: "calm-pulse 2.5s ease-in-out infinite",
          }}
        />
        <div
          className="absolute h-44 w-44 rounded-full"
          style={{
            border: `3px solid ${primary}`,
            animation: "calm-pulse 2.5s ease-in-out 0.6s infinite",
          }}
        />
        {/* Center emoji */}
        <div
          className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full"
          style={{ backgroundColor: `${primary}18` }}
        >
          <span className="text-5xl" role="img" aria-hidden>
            {accentEmoji}
          </span>
        </div>
      </div>

      <p
        className="mt-8 max-w-sm text-center text-lg font-medium"
        style={{ color: text }}
      >
        {waitingMessage}
      </p>
      <p className="mt-3 text-center text-sm text-gray-500">
        You don&apos;t need to do anything. I&apos;ll let you know when it&apos;s done.
      </p>

      {showLongWaitMessage && (
        <p
          className="mt-8 max-w-xs text-center text-sm"
          style={{ color: text, opacity: 0.9 }}
        >
          Taking a little longer than usual — still going! {accentEmoji}
        </p>
      )}
    </div>
  );
}
