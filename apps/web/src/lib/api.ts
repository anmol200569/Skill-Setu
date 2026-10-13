import { supabase, isSupabaseConfigured } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Cache the auth token to avoid calling getSession() on every API request
let cachedToken: string | null = null;
let cachedTokenExpiry = 0;
const TOKEN_CACHE_TTL = 30_000; // 30 seconds

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const devToken = typeof window !== 'undefined' ? localStorage.getItem('skill_setu_token') : null;
  if (devToken) {
    headers['Authorization'] = `Bearer ${devToken}`;
    return headers;
  }

  if (!isSupabaseConfigured) {
    return headers;
  }

  try {
    const now = Date.now();
    if (cachedToken && now < cachedTokenExpiry) {
      headers['Authorization'] = `Bearer ${cachedToken}`;
      return headers;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      cachedToken = token;
      cachedTokenExpiry = now + TOKEN_CACHE_TTL;
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      cachedToken = null;
      cachedTokenExpiry = 0;
    }
  } catch (err) {
    console.warn('Could not retrieve Supabase session for auth headers:', err);
  }

  return headers;
}

// Clear cached token on auth state changes (login/logout)
if (isSupabaseConfigured) {
  supabase.auth.onAuthStateChange(() => {
    cachedToken = null;
    cachedTokenExpiry = 0;
  });
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {})
    }
  };

  // If sending FormData (file uploads), remove Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    const h = config.headers as Record<string, string>;
    delete h['Content-Type'];
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorDetail = 'Request failed';
    let errorJson: any = null;
    try {
      errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || response.statusText;
    } catch {
      errorDetail = response.statusText;
    }
    const err: any = new Error(errorDetail);
    err.status = response.status;
    err.statusCode = response.status;
    err.degraded = errorJson?.degraded;
    throw err;
  }

  // Handle blob or json
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return (await response.blob()) as unknown as T;
  }

  return response.json();
}
