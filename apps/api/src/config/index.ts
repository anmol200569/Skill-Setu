import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

// Fail fast in production if required Supabase credentials are missing or placeholders
if (isProduction) {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    throw new Error('FATAL: SUPABASE_URL environment variable is required in production and cannot be a placeholder.');
  }
  if (!anonKey || anonKey.includes('placeholder')) {
    throw new Error('FATAL: SUPABASE_ANON_KEY environment variable is required in production and cannot be a placeholder.');
  }
  if (!serviceKey || serviceKey.includes('placeholder')) {
    throw new Error('FATAL: SUPABASE_SERVICE_ROLE_KEY environment variable is required in production and cannot be a placeholder.');
  }
  if (!process.env.INITIAL_ADMIN_EMAIL) {
    throw new Error('FATAL: INITIAL_ADMIN_EMAIL environment variable is required in production and has no default.');
  }
}

export const config = {
  env,
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  directUrl: process.env.DIRECT_URL || '',
  supabase: {
    url: isProduction
      ? process.env.SUPABASE_URL!
      : (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'),
    anonKey: isProduction
      ? process.env.SUPABASE_ANON_KEY!
      : (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'),
    serviceRoleKey: isProduction
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'),
    jwtSecret: process.env.SUPABASE_JWT_SECRET || ''
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || '',
    timeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS || '45000', 10)
  },
  initialAdminEmail: isProduction
    ? process.env.INITIAL_ADMIN_EMAIL!
    : (process.env.INITIAL_ADMIN_EMAIL || 'admin@skillsetu.dev')
};
