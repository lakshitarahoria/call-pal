import { NextRequest, NextResponse } from 'next/server';
import { getTheme } from '@/lib/theme';
import profile from '@/data/user-profile.json';

// GET /api/theme — returns the theme for the current user
// GET /api/theme?favourite=barbie — returns theme for any keyword
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const favourite = searchParams.get('favourite') ?? (profile as any).theme_preference;

  const theme = getTheme(favourite);
  return NextResponse.json(theme);
}
