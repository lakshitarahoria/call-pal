'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setAppMode as persistAppMode } from '@/lib/app-mode';
import { useAppContext } from '@/src/AppContext';
import { getProfile } from '@/src/api';

export default function ModeSelectionScreen() {
  const router = useRouter();
  const { setAppMode, setUserProfile } = useAppContext();
  const [powerLoading, setPowerLoading] = useState(false);

  const handleCalm = () => {
    setAppMode('calm');
    persistAppMode('calm');
    router.push('/onboarding/calm');
  };

  const handlePower = async () => {
    setAppMode('power');
    persistAppMode('power');
    setPowerLoading(true);
    try {
      const profile = await getProfile();
      setUserProfile(profile);
      router.push('/power');
    } catch {
      router.push('/power');
    } finally {
      setPowerLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <h1 className="mb-12 max-w-lg text-center text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
        How would you like CallPal to feel?
      </h1>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleCalm}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-[#7C3AED] px-8 py-10 text-left transition active:scale-[0.98] sm:min-h-[280px]"
          style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}
        >
          <span className="text-5xl sm:text-6xl" role="img" aria-hidden>
            🌿
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold text-[#1F2937]">
              Calm & Guided
            </span>
            <span className="text-sm text-[#6B7280]">
              Step by step. No rush.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={handlePower}
          disabled={powerLoading}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-[#374151] bg-[#1F2937] px-8 py-10 text-left transition active:scale-[0.98] disabled:opacity-70 sm:min-h-[280px]"
        >
          <span className="text-5xl sm:text-6xl" role="img" aria-hidden>
            ⚡
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold text-white">
              Quick & Simple
            </span>
            <span className="text-sm text-[#9CA3AF]">
              Type it, send it, done.
            </span>
          </div>
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-[#9CA3AF]">
        You can change this anytime in Settings
      </p>
    </div>
  );
}
