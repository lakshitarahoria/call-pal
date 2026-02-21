import { NextRequest, NextResponse } from 'next/server';
import { getTheme } from '@/lib/theme';
import profile from '@/data/user-profile.json';

// Called on first launch when user answers "What's your favourite thing?"
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, favourite_thing, mode } = body;

  if (!name || !favourite_thing) {
    return NextResponse.json(
      { error: 'name and favourite_thing are required' },
      { status: 400 }
    );
  }

  const theme = getTheme(favourite_thing);

  // In production this writes to a database.
  // For now return the merged profile so Lovable can store it locally.
  const updatedProfile = {
    ...profile,
    name,
    mode: mode ?? 'calm',
    theme_preference: favourite_thing,
    onboarding_complete: true,
  };

  return NextResponse.json({
    profile: updatedProfile,
    theme,
  });
}
