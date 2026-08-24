import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = sanitizeNextPath(searchParams.get('next') ?? '/dashboard');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error if code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

// Only same-origin relative paths are allowed; blocks protocol-relative
// ("//evil.com") and absolute URLs from redirecting off-site.
function sanitizeNextPath(next: string): string {
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return '/dashboard';
  }
  return next;
}
