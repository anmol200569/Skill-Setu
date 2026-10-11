import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

// Server-side Supabase Client with Service Role Key
// Never exposed to client-side browsers
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
