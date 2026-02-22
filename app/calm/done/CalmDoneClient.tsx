"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { getTranscript } from "@/src/api";
import type { TranscriptLine } from "@/lib/types";

interface TranscriptResponse {
  lines?: TranscriptLine[];
  error?: string;
}

function buildSummaryText(lines: TranscriptLine[]): string {
  return lines
    .map((line) => {
      const label = line.speaker === "agent" ? "CallPal" : "Representative";
      return `${label}: ${line.text}`;
    })
    .join("\n\n");
}

export default function CalmDoneClient() {
  const router = useRouter();
  const { theme, currentCallId } = useAppContext();
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [loading, setLoading] = useState(true);

  const primary = theme?.primaryColor ?? "#7C3AED";
  const text = theme?.textColor ?? "#1F2937";
  const accentEmoji = theme?.accentEmoji ?? "💜";
  const successMessage = theme?.successMessage ?? "All done!";

  useEffect(() => {
    if (!currentCallId) {
      router.replace("/calm");
      return;
    }

    let cancelled = false;
    getTranscript(currentCallId)
      .then((data: TranscriptResponse) => {
        if (cancelled) return;
        if (Array.isArray(data?.lines)) {
          setLines(data.lines);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentCallId, router]);

  const handleBackToHome = () => {
    router.push("/calm");
  };

  const handleShareSummary = async () => {
    const summary = buildSummaryText(lines);
    const title = "Call summary";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
        });
      } catch (err) {
        // User cancelled or share failed — fallback to clipboard
        try {
          await navigator.clipboard.writeText(summary);
        } catch {
          // ignore
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(summary);
      } catch {
        // ignore
      }
    }
  };

  if (!currentCallId) {
    return null;
  }

  return (
    <main
      className="flex min-h-full flex-col px-6 pb-28 pt-8 sm:px-8 sm:pt-10"
      style={{ backgroundColor: theme?.backgroundColor ?? "#FFFFFF" }}
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-6xl" role="img" aria-hidden>
          {accentEmoji}
        </span>
        <h1
          className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl"
          style={{ color: text }}
        >
          {successMessage}
        </h1>
      </div>

      <div
        className="mt-8 rounded-2xl border px-5 py-5"
        style={{
          borderColor: `${primary}25`,
          backgroundColor: `${primary}08`,
        }}
      >
        <h2
          className="mb-4 text-lg font-semibold"
          style={{ color: text }}
        >
          What happened on the call
        </h2>

        {loading ? (
          <p className="py-4 text-base opacity-70" style={{ color: text }}>
            Loading...
          </p>
        ) : lines.length === 0 ? (
          <p className="py-4 text-base opacity-70" style={{ color: text }}>
            No transcript available.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {lines.map((line, i) => (
              <div
                key={i}
                className={
                  line.speaker === "agent"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <span
                  className="max-w-[85%] rounded-2xl px-4 py-3 text-base leading-relaxed"
                  style={
                    line.speaker === "agent"
                      ? {
                          backgroundColor: primary,
                          color: "#FFFFFF",
                        }
                      : {
                          backgroundColor: "#F3F4F6",
                          color: text,
                        }
                  }
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleBackToHome}
          className="w-full rounded-full py-3.5 text-base font-medium text-white transition hover:opacity-95"
          style={{ backgroundColor: primary }}
        >
          Back to home
        </button>
        <button
          type="button"
          onClick={handleShareSummary}
          className="w-full rounded-full py-3.5 text-base font-medium transition hover:opacity-90"
          style={{ color: primary }}
        >
          Share summary
        </button>
      </div>
    </main>
  );
}
