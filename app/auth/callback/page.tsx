import type { Metadata } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Email Verification | FairwayFund',
  description: 'Verifying your email address...',
};

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string; error?: string; error_description?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;
  const next = params.next || '/dashboard';
  const error = params.error;
  const errorDescription = params.error_description;

  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    redirect(`/login?error=${encodeURIComponent(errorDescription || 'Email verification failed')}`);
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      redirect(`/login?error=${encodeURIComponent('Email verification failed. Please try again.')}`);
    }
  }

  redirect(next);
}