import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase, formatAuthError } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Verifying your session...');

  useEffect(() => {
    let isCancelled = false;

    async function handleAuthCallback() {
      try {
        // 1. Check for error parameters in URL query or hash
        const searchParams = new URLSearchParams(location.search);
        const hash = location.hash.startsWith('#') ? location.hash.substring(1) : location.hash;
        const hashParams = new URLSearchParams(hash);

        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription =
          searchParams.get('error_description') || hashParams.get('error_description');

        if (error || errorDescription) {
          const detail = errorDescription || error || 'Authentication was declined or failed.';
          setErrorMessage(decodeURIComponent(detail.replace(/\+/g, ' ')));
          return;
        }

        // 2. Check for PKCE authorization code in query string
        const code = searchParams.get('code');
        if (code) {
          setStatusText('Exchanging authorization code with provider...');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        }

        // 3. Confirm active session from Supabase
        setStatusText('Finalizing authentication...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          // If session is not immediately available, wait briefly for onAuthStateChange
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (!retrySession) {
            throw new Error('No active session could be retrieved. Please try signing in again.');
          }
        }

        if (isCancelled) return;

        // 4. Sync profile with backend and navigate
        setStatusText('Loading profile...');
        await refreshProfile();

        if (!isCancelled) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('OAuth Callback processing error:', err);
          setErrorMessage(formatAuthError(err));
        }
      }
    }

    handleAuthCallback();

    return () => {
      isCancelled = true;
    };
  }, [location, navigate, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card p-8 border border-border rounded-2xl shadow-xl text-center space-y-4">
        {errorMessage ? (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Authentication Failed</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{errorMessage}</p>
            <div className="pt-4 flex flex-col gap-2">
              <Link to="/login">
                <Button className="w-full">Return to Sign In</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full text-xs">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-lg text-foreground">Authenticating</h3>
            <p className="text-xs text-muted-foreground">{statusText}</p>
          </>
        )}
      </div>
    </div>
  );
}
