import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
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
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || response.statusText;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  // Handle blob or json
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return (await response.blob()) as unknown as T;
  }

  return response.json();
}
