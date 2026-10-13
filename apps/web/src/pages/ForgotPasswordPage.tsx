import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {t('auth.forgot.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t('auth.forgot.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card py-8 px-6 shadow-md border border-border rounded-xl sm:px-10">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                {t('auth.forgot.successTitle')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('auth.forgot.successDesc')}
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    {t('auth.forgot.backLogin')}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {authError && (
                <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  label={t('auth.forgot.emailLabel')}
                  placeholder={t('auth.forgot.emailPlaceholder')}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  isLoading={isSubmitting}
                >
                  {t('auth.forgot.submit')}
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                {t('auth.forgot.remember')}{' '}
                <Link to="/login" className="font-semibold text-[#C2410C] hover:underline">
                  {t('auth.forgot.signIn')}
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('auth.forgot.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
