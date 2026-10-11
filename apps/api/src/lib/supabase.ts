import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

// Standard Supabase Client using publishable/anon key for user JWT verification
export const supabaseAuth = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Privileged Supabase Admin Client using service-role key (only used for admin-level operations)
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
