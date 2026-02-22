"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { completeOnboarding, getProfile } from "@/src/api";
import type { Theme } from "@/lib/theme";

interface OnboardingResponse {
  profile: object;
  theme: Theme;
}

export default function CalmOnboardingClient() {
  const router = useRouter();
  const { userProfile, setUserProfile, setTheme } = useAppContext();
  const [favourite, setFavourite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [blooming, setBlooming] = useState(false);
  const [bloomTheme, setBloomTheme] = useState<Theme | null>(null);

  const profile = userProfile as { onboarding_complete?: boolean } | null;
  const alreadyComplete = profile?.onboarding_complete === true;

  // Only show once: redirect if we already have completed profile, or fetch and redirect
  useEffect(() => {
    if (alreadyComplete) {
      router.replace("/calm");
      return;
    }
    let cancelled = false;
    getProfile()
      .then((data: { onboarding_complete?: boolean }) => {
        if (cancelled) return;
        if (data?.onboarding_complete === true) {
          setUserProfile(data);
          router.replace("/calm");
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [alreadyComplete, router, setUserProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = favourite.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    try {
      const res = await completeOnboarding("Alex", value, "calm") as OnboardingResponse;
      setUserProfile(res.profile);
      setTheme(res.theme);
      setBloomTheme(res.theme);
      requestAnimationFrame(() => setBlooming(true));
      const t = setTimeout(() => {
        router.push("/calm");
      }, 1200);
      return () => clearTimeout(t);
    } catch {
      setSubmitting(false);
    }
  };

  if (alreadyComplete) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-white px-8 py-16 sm:px-12 sm:py-20 md:px-20 md:py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <p className="mb-12 text-sm font-medium text-[#7C3AED]">CallPal</p>

          <h1 className="mb-3 text-center text-3xl font-semibold leading-tight text-[#1F2937] sm:text-4xl">
            Before we start, tell us one thing 💜
          </h1>
          <p className="mb-10 text-center text-base text-[#6B7280]">
            What&apos;s your favourite thing in the world?
          </p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
            <input
              type="text"
              value={favourite}
              onChange={(e) => setFavourite(e.target.value)}
              placeholder="Barbie, space, cats, dinosaurs..."
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white px-5 py-4 text-base text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:outline-none focus:ring-0"
              autoComplete="off"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={!favourite.trim() || submitting}
              className="rounded-full bg-[#7C3AED] px-8 py-3.5 text-base font-medium text-white transition hover:bg-[#6D28D9] disabled:opacity-50"
            >
              Make CallPal mine 💜
            </button>
          </form>
        </div>
      </div>

      {/* Bloom overlay: expands from center with new theme colors */}
      {bloomTheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-hidden
        >
          <div
            className="h-[200vmax] w-[200vmax] rounded-full transition-transform duration-[1000ms] ease-out"
            style={{
              backgroundColor: bloomTheme.backgroundColor,
              transform: blooming ? "scale(1)" : "scale(0)",
              transformOrigin: "center center",
            }}
          />
        </div>
      )}
    </>
  );
}
