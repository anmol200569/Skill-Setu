import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  Briefcase,
  Layers,
  Globe,
  Search,
  Check
} from 'lucide-react';

interface CareerRoleItem {
  id: string;
  code: string;
  title: string;
  description: string;
  industryDemand: string;
  roleCompetencies?: any[];
  skillsRequired?: any[];
}

export function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  // If user is already onboarded with a saved target role, redirect directly to dashboard
  useEffect(() => {
    if (profile?.isOnboarded && profile?.targetRoleId) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile, navigate]);

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Roles state
  const [roles, setRoles] = useState<CareerRoleItem[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [roleSearch, setRoleSearch] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Experience level state
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  // Weekly commitment & language state
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>('en');

  // Prefill tracking
  const [isPrefilled, setIsPrefilled] = useState(false);

  // Form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync preferred language from current i18n
  useEffect(() => {
    if (i18n.language.startsWith('hi')) {
      setPreferredLanguage('hi');
    } else {
      setPreferredLanguage('en');
    }
  }, [i18n.language]);

  // Fetch career roles on mount & prefill from profile / landing wizard
  useEffect(() => {
    let isMounted = true;
    setIsLoadingRoles(true);

    apiClient<CareerRoleItem[]>('/competency/roles')
      .then((data) => {
        if (!isMounted) return;
        const fetchedRoles = data || [];
        setRoles(fetchedRoles);

        let prefilledApplied = false;

        // Priority 1: User profile target role (e.g. Data Analyst)
        let profileRoleMatch: CareerRoleItem | undefined;
        if (profile?.targetRoleId) {
          profileRoleMatch = fetchedRoles.find(
            (r) => r.id === profile.targetRoleId || r.code === profile.targetRoleId
          );
        }
        if (!profileRoleMatch && (profile?.targetRole?.code || profile?.targetRoleName)) {
          const nameToMatch = (profile.targetRole?.code || profile.targetRoleName || '').toLowerCase();
          profileRoleMatch = fetchedRoles.find(
            (r) => r.code.toLowerCase().includes(nameToMatch) || r.title.toLowerCase().includes(nameToMatch)
          );
        }

        if (profileRoleMatch) {
          setSelectedRoleId(profileRoleMatch.id);
          prefilledApplied = true;
        }

        // Priority 2: Query params from wizard
        let targetRoleCode = searchParams.get('role');
        let targetLevel = searchParams.get('level');
        let targetHours = searchParams.get('hours');

        // Priority 3: localStorage from visitor wizard
        if (!targetRoleCode || !targetLevel || !targetHours) {
          try {
            const saved = localStorage.getItem('skill_setu_pathway');
            if (saved) {
              const parsed = JSON.parse(saved);
              targetRoleCode = targetRoleCode || parsed.role;
              targetLevel = targetLevel || parsed.level;
              targetHours = targetHours || parsed.hours;
            }
          } catch (_) {}
        }

        if (!profileRoleMatch && targetRoleCode) {
          const matched = fetchedRoles.find(
            (r) => r.code === targetRoleCode || r.id === targetRoleCode || r.title.toLowerCase().includes(targetRoleCode.toLowerCase())
          );
          if (matched) {
            setSelectedRoleId(matched.id);
            prefilledApplied = true;
          }
        }

        if (targetLevel === 'beginner' || targetLevel === 'intermediate' || targetLevel === 'advanced') {
          setSelectedLevel(targetLevel);
          prefilledApplied = true;
        }

        if (targetHours) {
          if (targetHours === '3-5') setWeeklyHours(4);
          else if (targetHours === '6-10') setWeeklyHours(8);
          else if (targetHours === '10+') setWeeklyHours(15);
          else {
            const parsedH = parseInt(targetHours, 10);
            if (!isNaN(parsedH) && parsedH > 0) setWeeklyHours(parsedH);
          }
          prefilledApplied = true;
        }

        if (prefilledApplied) {
          setIsPrefilled(true);
        }
      })
      .catch((err) => {
        console.warn('Could not load roles:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRoles(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleNext = () => {
    if (step === 1 && !selectedRoleId) {
      setErrorMsg('Please select a target role to proceed.');
      return;
    }
    setErrorMsg(null);
    setStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleComplete = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const expYears =
        selectedLevel === 'beginner' ? 1 : selectedLevel === 'intermediate' ? 3 : 6;
      const currentStatus = selectedLevel === 'beginner' ? 'student' : 'employed';

      await apiClient('/profile/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          fullName: user?.user_metadata?.fullName || user?.email?.split('@')[0] || 'Learner',
          education: 'Independent Learner / Technical Higher Education',
          experienceYears: expYears,
          currentStatus,
          targetRoleId: selectedRoleId,
          preferredLanguage,
          weeklyStudyHours: Number(weeklyHours),
          learningPreferences: ['Hands-on Projects', 'Diagnostic Assessments']
        })
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      await refreshProfile();

      // D1: Navigate to /assessments with first required unassessed skill preselected and baseline prompt (not straight to /dashboard)
      const selectedRole = roles.find((r) => r.id === selectedRoleId);
      const firstSkillId =
        selectedRole?.skillsRequired?.[0]?.skillId ||
        selectedRole?.skillsRequired?.[0]?.skill?.id ||
        '';

      if (firstSkillId) {
        navigate(`/assessments?skillId=${encodeURIComponent(firstSkillId)}&startBaseline=true`);
      } else {
        navigate('/assessments?startBaseline=true');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedRoleObj = roles.find((r) => r.id === selectedRoleId);
  const filteredRoles = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(roleSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(roleSearch.toLowerCase()) ||
      r.code.toLowerCase().includes(roleSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-[#C2410C] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm flex-shrink-0">
              S
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground whitespace-nowrap">
              Skill Setu
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {t('onboarding.brandSubtitle')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('onboarding.stepProgress', {
              current: step,
              total: totalSteps,
              title:
                step === 1
                  ? t('onboarding.step1.title')
                  : step === 2
                  ? t('onboarding.step2.title')
                  : t('onboarding.step3.title')
            })}
          </p>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center gap-2 pt-2 max-w-xs mx-auto">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx + 1 <= step ? 'bg-[#C2410C]' : 'bg-secondary'
                }`}
              />
            ))}
          </div>

          {/* Prefilled Banner Notification */}
          {isPrefilled && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C2410C]/10 border border-[#C2410C]/20 text-[11px] font-medium text-[#C2410C]">
              <Sparkles className="w-3 h-3" />
              <span>{t('onboarding.prefilledNotice')}</span>
            </div>
          )}
        </div>

        {/* Card Container */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-sm relative">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Target Role */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h2 className="font-serif font-bold text-lg text-foreground">
                  {t('onboarding.step1.title')}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('onboarding.step1.subtitle')}
                </p>
              </div>

              {/* Role Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('onboarding.step1.searchPlaceholder')}
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>

              {/* Roles List */}
              {isLoadingRoles ? (
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-border bg-secondary/30 animate-pulse space-y-2"
                    >
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-4/5" />
                    </div>
                  ))}
                </div>
              ) : filteredRoles.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  {t('onboarding.step1.noRolesFound')}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredRoles.map((r) => {
                    const isSelected = selectedRoleId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRoleId(r.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#C2410C] bg-[#C2410C]/5 ring-1 ring-[#C2410C] shadow-sm'
                            : 'border-border bg-card hover:bg-secondary/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-serif font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                              <span>{r.title}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#C2410C] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {r.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Experience Level */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="font-serif font-bold text-lg text-foreground">
                  {t('onboarding.step2.title')}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('onboarding.step2.subtitle')}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'beginner' as const,
                    title: t('onboarding.step2.levels.beginner.title'),
                    experience: t('onboarding.step2.levels.beginner.experience'),
                    desc: t('onboarding.step2.levels.beginner.desc')
                  },
                  {
                    key: 'intermediate' as const,
                    title: t('onboarding.step2.levels.intermediate.title'),
                    experience: t('onboarding.step2.levels.intermediate.experience'),
                    desc: t('onboarding.step2.levels.intermediate.desc')
                  },
                  {
                    key: 'advanced' as const,
                    title: t('onboarding.step2.levels.advanced.title'),
                    experience: t('onboarding.step2.levels.advanced.experience'),
                    desc: t('onboarding.step2.levels.advanced.desc')
                  }
                ].map((lvl) => {
                  const isSelected = selectedLevel === lvl.key;
                  return (
                    <div
                      key={lvl.key}
                      onClick={() => setSelectedLevel(lvl.key)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C2410C] bg-[#C2410C]/5 ring-1 ring-[#C2410C] shadow-sm'
                          : 'border-border bg-card hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-serif font-bold text-sm sm:text-base text-foreground">
                          {lvl.title}
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {lvl.experience}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {lvl.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
                {t('onboarding.step2.baselineNotice')}
              </div>
            </div>
          )}

          {/* STEP 3: Weekly Commitment & Preferences */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="font-serif font-bold text-lg text-foreground">
                  {t('onboarding.step3.title')}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('onboarding.step3.subtitle')}
                </p>
              </div>

              {/* Weekly Study Hours */}
              <div className="space-y-2 p-4 rounded-xl border border-border bg-secondary/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                    {t('onboarding.step3.hoursTitle')}
                  </label>
                  <span className="font-bold text-sm text-[#C2410C]">
                    {t('onboarding.step3.hoursValue', { hours: weeklyHours })}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  step="1"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                  className="w-full accent-[#C2410C] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{t('onboarding.step3.hoursSliderMin')}</span>
                  <span>{t('onboarding.step3.hoursSliderMid')}</span>
                  <span>{t('onboarding.step3.hoursSliderMax')}</span>
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  {t('onboarding.step3.languageTitle')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLanguage('en');
                      i18n.changeLanguage('en');
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      preferredLanguage === 'en'
                        ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{t('onboarding.step3.langEn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLanguage('hi');
                      i18n.changeLanguage('hi');
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      preferredLanguage === 'hi'
                        ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{t('onboarding.step3.langHi')}</span>
                  </button>
                </div>
              </div>

              {/* Pathway Summary Card */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
                <div className="font-serif font-bold text-foreground text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
                  <span>{t('onboarding.step3.summaryHeading')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60 text-muted-foreground text-[11px]">
                  <div>
                    <span className="font-semibold text-foreground">
                      {t('onboarding.step3.summaryRole')}:{' '}
                    </span>
                    <span>{selectedRoleObj?.title || 'Selected Role'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      {t('onboarding.step3.summaryLevel')}:{' '}
                    </span>
                    <span className="capitalize">{selectedLevel}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      {t('onboarding.step3.summaryTime')}:{' '}
                    </span>
                    <span>{weeklyHours} hrs/wk</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      {t('onboarding.step3.summaryLanguage')}:{' '}
                    </span>
                    <span>{preferredLanguage === 'hi' ? 'हिन्दी' : 'English'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (Sticky to ensure effortless action across all scroll lengths) */}
          <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-sm -mx-6 sm:-mx-8 px-6 sm:px-8 py-4 border-t border-border mt-6 flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('onboarding.nav.back')}</span>
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-1 text-xs font-semibold"
              >
                <span>{t('onboarding.nav.next')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleComplete}
                isLoading={isSubmitting}
                className="flex items-center gap-1.5 text-xs font-semibold shadow-sm px-5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting
                    ? t('onboarding.step3.completingButton')
                    : t('onboarding.step3.completeButton')}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
