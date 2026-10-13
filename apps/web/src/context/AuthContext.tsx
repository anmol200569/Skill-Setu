import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { apiClient } from '../lib/api';
import { UserRole, UserProfile } from '@skill-setu/shared';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string, role?: 'learner' | 'trainer') => Promise<{ needsEmailVerification: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('learner');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBackendUserAndProfile = async () => {
    try {
      const data = await apiClient<{ user: { role: UserRole }; profile: UserProfile | null }>('/auth/me');
      if (data?.user) {
        setRole(data.user.role || 'learner');
      }
      if (data?.profile) {
        setProfile(data.profile);
      }
    } catch (err: any) {
      console.warn('Could not fetch backend profile sync:', err.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    const localDevToken = typeof window !== 'undefined' ? localStorage.getItem('skill_setu_token') : null;
    if (localDevToken) {
      const isPopulated = localDevToken === 'test-populated-token';
      const isEmpty = localDevToken === 'test-empty-token';
      const isPartial = localDevToken === 'test-partial-token';
      setUser({
        id: isPopulated
          ? 'eb99b4ac-fa46-4776-852b-ebc87fea2f49'
          : isEmpty
          ? 'test-empty-uuid'
          : isPartial
          ? 'test-partial-uuid'
          : 'test-learner-uuid',
        email: isPopulated
          ? 'anmolsingh12jbp7@gmail.com'
          : isEmpty
          ? 'newbie@skillsetu.dev'
          : isPartial
          ? 'partial@skillsetu.dev'
          : 'learner@skillsetu.dev',
        aud: 'authenticated',
        app_metadata: {},
        user_metadata: {
          fullName: isPopulated ? 'Anmol Singh' : isEmpty ? 'New Learner' : isPartial ? 'Alex Morgan' : 'Test Learner'
        },
        created_at: new Date().toISOString()
      } as any);
      setRole('learner');
      fetchBackendUserAndProfile().finally(() => {
        if (mounted) setIsLoading(false);
      });
      return () => {
        mounted = false;
      };
    }

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check current active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchBackendUserAndProfile().finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }).catch((err) => {
      console.warn('Supabase getSession failed:', err);
      if (mounted) setIsLoading(false);
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchBackendUserAndProfile();
      } else {
        setProfile(null);
        setRole('learner');
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase is not configured on this deployment. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Project Settings and redeploy.'
      );
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address before logging in.');
      }
      throw error;
    }
    await fetchBackendUserAndProfile();
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    requestedRole: 'learner' | 'trainer' = 'learner'
  ) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase is not configured on this deployment. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Project Settings and redeploy.'
      );
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          role: requestedRole
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email address already exists. Please log in.');
      }
      throw error;
    }

    const needsEmailVerification = !data.session;
    return { needsEmailVerification };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Google OAuth requires Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Project Settings, and enable the Google provider in Supabase Dashboard.'
      );
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skill_setu_token');
    }
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole('learner');
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set environment variables.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set environment variables.');
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const refreshProfile = async () => {
    await fetchBackendUserAndProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        profile,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
