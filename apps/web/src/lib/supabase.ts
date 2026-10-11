import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder')
);

// Instantiate Supabase client. Fall back safely to placeholder if not configured so imports do not throw.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Normalizes browser network errors and Supabase exceptions into human-readable messages.
 */
export function formatAuthError(err: any): string {
  if (!err) return 'An unexpected authentication error occurred.';
  const msg = err.message || String(err);
  
  if (
    msg.includes('NetworkError') ||
    msg.includes('Failed to fetch') ||
    msg.includes('Network request failed') ||
    err.name === 'TypeError'
  ) {
    if (!isSupabaseConfigured) {
      return 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing in this deployment. Please add them in Vercel Project Settings and redeploy.';
    }
    return `Unable to reach Supabase at ${supabaseUrl}. Please check that your Supabase project is active (not paused or deleted) and that the project reference is spelled correctly.`;
  }
  
  return msg;
}

