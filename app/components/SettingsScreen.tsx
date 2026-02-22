"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/src/AppContext";
import { completeOnboarding, updateProfile } from "@/src/api";
import type { Theme } from "@/lib/theme";

const CALM_PURPLE = "#7C3AED";
const POWER_DARK = "#1E293B";

interface ProfileLike {
  name?: string;
  theme_preference?: string | null;
  caregiver_name?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { appMode, setAppMode, userProfile, setUserProfile, setTheme, theme } = useAppContext();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [editingTheme, setEditingTheme] = useState(false);
  const [themeValue, setThemeValue] = useState("");
  const [saving, setSaving] = useState(false);

  const profile = userProfile as ProfileLike | null;
  const name = profile?.name ?? "Alex";
  const themeLabel = theme?.label ?? "Calm";
  const themeEmoji = theme?.accentEmoji ?? "🌿";
  const caregiverName = profile?.caregiver_name ?? "—";

  const handleModeSwitch = (mode: "calm" | "power") => {
    setAppMode(mode);
    if (mode === "calm") router.push("/calm");
    else router.push("/power");
  };

  const handleNameTap = () => {
    setNameValue(name);
    setEditingName(true);
  };

  const handleNameSave = async () => {
    const v = nameValue.trim();
    if (!v) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({ name: v }) as ProfileLike;
      setUserProfile(updated);
    } finally {
      setSaving(false);
      setEditingName(false);
    }
  };

  const handleThemeTap = () => {
    setThemeValue(profile?.theme_preference ?? "");
    setEditingTheme(true);
  };

  const handleThemeSave = async () => {
    const v = themeValue.trim();
    if (!v) {
      setEditingTheme(false);
      return;
    }
    setSaving(true);
    try {
      const res = await completeOnboarding(name, v, "calm") as { profile: object; theme: object };
      setUserProfile(res.profile);
      setTheme(res.theme as Theme);
    } finally {
      setSaving(false);
      setEditingTheme(false);
    }
  };

  return (
    <main className="min-h-full bg-white px-6 pb-28 pt-8 sm:px-8">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Settings</h1>

      {/* ACCOUNT */}
      <section className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
          Account
        </p>
        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-base text-zinc-900"
              autoFocus
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
            />
            <button
              type="button"
              onClick={handleNameSave}
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNameTap}
            className="block w-full rounded-lg border border-zinc-200 bg-zinc-50 py-3 px-4 text-left text-base text-zinc-900"
          >
            Name: {name}
          </button>
        )}
      </section>

      {/* MODE */}
      <section className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
          Mode
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleModeSwitch("calm")}
            className="flex-1 rounded-xl border-2 py-3 text-center text-sm font-medium transition"
            style={{
              borderColor: appMode === "calm" ? CALM_PURPLE : "#E5E7EB",
              backgroundColor: appMode === "calm" ? `${CALM_PURPLE}15` : "transparent",
              color: appMode === "calm" ? CALM_PURPLE : "#6B7280",
            }}
          >
            🌿 Calm
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("power")}
            className="flex-1 rounded-xl border-2 py-3 text-center text-sm font-medium transition"
            style={{
              borderColor: appMode === "power" ? POWER_DARK : "#E5E7EB",
              backgroundColor: appMode === "power" ? POWER_DARK : "transparent",
              color: appMode === "power" ? "#FFFFFF" : "#6B7280",
            }}
          >
            ⚡ Power
          </button>
        </div>
      </section>

      {/* CALM MODE THEME - only when calm */}
      {appMode === "calm" && (
        <section className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Calm mode theme
          </p>
          {editingTheme ? (
            <div className="space-y-2">
              <input
                type="text"
                value={themeValue}
                onChange={(e) => setThemeValue(e.target.value)}
                placeholder="Change your favourite thing"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleThemeSave}
                  disabled={saving || !themeValue.trim()}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTheme(false)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleThemeTap}
              className="block w-full rounded-lg border border-zinc-200 bg-zinc-50 py-3 px-4 text-left text-base text-zinc-900"
            >
              Your theme: {themeLabel} {themeEmoji}
            </button>
          )}
        </section>
      )}

      {/* CAREGIVER ACCESS - calm only */}
      {appMode === "calm" && (
        <section className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Caregiver access
          </p>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 py-3 px-4 text-base text-zinc-700">
            Caregiver: {caregiverName}
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
          About
        </p>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 py-3 px-4 text-sm text-zinc-600">
          <p className="font-medium text-zinc-800">Version 1.0</p>
          <p className="mt-1">
            Built with care for everyone who finds phone calls hard.
          </p>
        </div>
      </section>
    </main>
  );
}
