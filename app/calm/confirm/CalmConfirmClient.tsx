"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { makeCall } from "@/src/api";
import type { Intent } from "@/lib/types";

export default function CalmConfirmClient() {
  const router = useRouter();
  const { theme, currentIntent, setCurrentCallId } = useAppContext();
  const [loading, setLoading] = useState(false);

  const intent = currentIntent as Intent | null;
  const primary = theme?.primaryColor ?? "#7C3AED";
  const text = theme?.textColor ?? "#1F2937";
  const accentEmoji = theme?.accentEmoji ?? "💜";
  const callButtonText = theme?.callButtonText ?? "Let CallPal handle it";

  useEffect(() => {
    if (!intent) {
      router.replace("/calm");
    }
  }, [intent, router]);

  const handleMakeCall = async () => {
    if (!intent || loading) return;
    setLoading(true);
    try {
      const result = await makeCall(intent, "calm") as { callId?: string };
      if (result?.callId) {
        setCurrentCallId(result.callId);
      }
      router.push("/calm/calling");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSomething = () => {
    router.push("/calm/input");
  };

  if (!intent) {
    return null;
  }

  return (
    <main
      className="flex min-h-full flex-col px-6 pt-8 sm:px-8 sm:pt-10"
      style={{ backgroundColor: theme?.backgroundColor ?? "#FFFFFF" }}
    >
      <h1
        className="mb-6 text-2xl font-semibold leading-tight sm:text-3xl"
        style={{ color: text }}
      >
        Here&apos;s what I understood {accentEmoji}
      </h1>

      <div
        className="mb-8 rounded-2xl border-2 px-5 py-5"
        style={{
          borderColor: `${primary}30`,
          backgroundColor: `${primary}08`,
        }}
      >
        <p className="mb-2 text-base" style={{ color: text }}>
          <span className="font-medium">Calling:</span> {intent.provider_name}
        </p>
        <p className="mb-2 text-base" style={{ color: text }}>
          <span className="font-medium">About:</span> {intent.reason}
        </p>
        {intent.time_preference ? (
          <p className="text-base" style={{ color: text }}>
            <span className="font-medium">Preferred time:</span>{" "}
            {intent.time_preference}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleMakeCall}
          disabled={loading}
          className="w-full rounded-full py-3.5 text-base font-medium text-white transition disabled:opacity-70"
          style={{ backgroundColor: primary }}
        >
          {loading ? "Starting call..." : callButtonText}
        </button>
        <button
          type="button"
          onClick={handleChangeSomething}
          className="w-full rounded-full py-3.5 text-base font-medium transition hover:opacity-90"
          style={{ color: primary }}
        >
          Change something
        </button>
      </div>
    </main>
  );
}
