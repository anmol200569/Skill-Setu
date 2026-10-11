import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { formatAuthError, isSupabaseConfigured } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  role: z.enum(['learner', 'trainer'])
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'learner'
    }
  });

  // Reset loading state when navigating back via browser bfcache
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsGoogleSubmitting(false);
        setIsSubmitting(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    if (isSubmitting || isGoogleSubmitting) return;
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const { needsEmailVerification } = await signUpWithEmail(
        data.email,
        data.password,
        data.fullName,
        data.role
      );

      if (needsEmailVerification) {
        setRegisteredEmail(data.email);
        setVerificationPending(true);
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setAuthError(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isGoogleSubmitting || isSubmitting) return;
    setAuthError(null);
    setIsGoogleSubmitting(true);

    const guardTimeout = setTimeout(() => {
      setIsGoogleSubmitting(false);
      setAuthError('Google sign-up request timed out. Please try again.');
    }, 12000);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      clearTimeout(guardTimeout);
      setAuthError(formatAuthError(err));
      setIsGoogleSubmitting(false);
    }
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full bg-card p-8 border border-border rounded-2xl shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Verify your email address</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We have sent a secure confirmation link to <span className="font-semibold text-foreground">{registeredEmail}</span>.
            Please click the link in your email to activate your account and start your skill diagnostics.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Return to Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Skill Setu" className="w-10 h-10 rounded-lg shadow-sm" />
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">Skill Setu</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-foreground">
          Create your Skill Setu account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Map your competencies and get personalized career roadmaps
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card py-8 px-6 shadow-md border border-border rounded-xl sm:px-10">
          {!isSupabaseConfigured && (
            <div className="mb-6 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="font-semibold">Supabase Configuration Required</p>
                <p className="leading-relaxed">
                  Authentication requires <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code>. Please configure them in your Vercel Project Settings.
                </p>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground/80">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    selectedRole === 'learner'
                      ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                      : 'border-border bg-card text-foreground/80 hover:bg-muted'
                  }`}
                >
                  <input type="radio" value="learner" className="sr-only" {...register('role')} />
                  Learner / Professional
                </label>
                <label
                  className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    selectedRole === 'trainer'
                      ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                      : 'border-border bg-card text-foreground/80 hover:bg-muted'
                  }`}
                >
                  <input type="radio" value="trainer" className="sr-only" {...register('role')} />
                  Instructor / Trainer
                </label>
              </div>
            </div>

            <Input
              id="fullName"
              label="Full Name"
              placeholder="e.g. Anmol Singh"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@domain.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8.5 text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-semibold"
              isLoading={isSubmitting}
              disabled={isSubmitting || isGoogleSubmitting}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignUp}
                isLoading={isGoogleSubmitting}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#C2410C] hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
