import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Briefcase,
  Target,
  Sliders,
  Globe,
  Clock
} from 'lucide-react';

interface CareerRoleItem {
  id: string;
  code: string;
  title: string;
  description: string;
  industryDemand: string;
}

interface SkillItem {
  id: string;
  name: string;
  category: string;
  domain?: { name: string };
}

export function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [fullName, setFullName] = useState(user?.user_metadata?.fullName || '');
  const [education, setEducation] = useState('Bachelor of Technology (Computer Science)');
  const [experienceYears, setExperienceYears] = useState(1);
  const [currentStatus, setCurrentStatus] = useState<'student' | 'job_seeker' | 'employed' | 'career_changer'>('student');
  const [currentRole, setCurrentRole] = useState('');

  const [roles, setRoles] = useState<CareerRoleItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [careerGoals, setCareerGoals] = useState('');

  const [skillsList, setSkillsList] = useState<SkillItem[]>([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<Record<string, number>>({});

  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>('en');
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(12);
  const [learningPreferences, setLearningPreferences] = useState<string[]>([
    'Hands-on Projects',
    'Interactive Quizzes'
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Career Roles and Skills on mount
  useEffect(() => {
    apiClient<CareerRoleItem[]>('/competency/roles')
      .then((data) => {
        setRoles(data || []);
        if (data && data.length > 0) {
          setSelectedRoleId(data[0].id);
        }
      })
      .catch((err) => console.warn('Could not load roles:', err));

    apiClient<SkillItem[]>('/competency/skills')
      .then((data) => {
        setSkillsList(data || []);
        // Seed default initial levels for top skills
        const initialMap: Record<string, number> = {};
        (data || []).slice(0, 6).forEach((s) => {
          initialMap[s.id] = 2; // Default baseline 2/5
        });
        setSelectedSkillLevels(initialMap);
      })
      .catch((err) => console.warn('Could not load skills:', err));
  }, []);

  const handleNext = () => {
    if (step === 1 && !fullName.trim()) {
      setErrorMsg('Please enter your full name to proceed.');
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
      const initialSkillsPayload = Object.entries(selectedSkillLevels).map(([skillId, selfAssessedLevel]) => ({
        skillId,
        selfAssessedLevel
      }));

      await apiClient('/profile/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          education,
          experienceYears: Number(experienceYears),
          currentStatus,
          currentRole: currentRole || undefined,
          targetRoleId: selectedRoleId,
          careerGoals: careerGoals || undefined,
          preferredLanguage,
          weeklyStudyHours: Number(weeklyStudyHours),
          learningPreferences,
          initialSkills: initialSkillsPayload
        })
      });

      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const togglePreference = (pref: string) => {
    if (learningPreferences.includes(pref)) {
      setLearningPreferences(learningPreferences.filter((p) => p !== pref));
    } else {
      setLearningPreferences([...learningPreferences, pref]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.svg" alt="Skill Setu" className="w-8 h-8 rounded" />
            <span className="font-serif text-2xl font-bold text-foreground">Skill Setu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Personalize Your Skill Diagnostic Path
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step {step} of {totalSteps}: {step === 1 && 'Background & Education'}
            {step === 2 && 'Target Career Goal'}
            {step === 3 && 'Baseline Skill Self-Assessment'}
            {step === 4 && 'Learning Style & Study Hours'}
          </p>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-4 max-w-xs mx-auto">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  idx + 1 <= step ? 'bg-[#C2410C]' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-lg relative">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Personal Background & Education */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <Input
                label="Full Name"
                placeholder="e.g. Anmol Singh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground/80">Current Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'student', label: 'Student' },
                    { key: 'job_seeker', label: 'Job Seeker' },
                    { key: 'employed', label: 'Employed' },
                    { key: 'career_changer', label: 'Career Switcher' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCurrentStatus(item.key as any)}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-colors ${
                        currentStatus === item.key
                          ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                          : 'border-border bg-secondary/30 text-foreground/80 hover:bg-muted'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Education / Degree"
                placeholder="e.g. Bachelor of Computer Applications / Self-taught"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Years of Technical Experience"
                  type="number"
                  min="0"
                  max="30"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
                />
                <Input
                  label="Current Role (if any)"
                  placeholder="e.g. Junior Developer, Student Intern"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Target Career Goal */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-2">
                  Select Your Target Technology Role
                </label>
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoleId(r.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedRoleId === r.id
                          ? 'border-[#C2410C] bg-[#C2410C]/5 shadow-sm ring-1 ring-[#C2410C]'
                          : 'border-border bg-card hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-serif font-bold text-base text-foreground">{r.title}</div>
                        <Badge variant={r.industryDemand === 'Critical' ? 'critical' : 'high'}>
                          {r.industryDemand} Demand
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Input
                label="Career Goal / Timeline (Optional)"
                placeholder="e.g. Crack software engineer role in next 6 months"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
              />
            </div>
          )}

          {/* Step 3: Baseline Skill Self-Assessment (1-5 Scale) */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
                Rate your baseline confidence on a scale of <strong>1 (Novice)</strong> to <strong>5 (Expert)</strong>. Diagnostic assessments will calibrate verified scores later.
              </div>

              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {skillsList.slice(0, 7).map((skill) => {
                  const currentLevel = selectedSkillLevels[skill.id] || 1;
                  return (
                    <div key={skill.id} className="p-3.5 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-sm text-foreground">{skill.name}</div>
                          <div className="text-[11px] text-muted-foreground">{skill.category}</div>
                        </div>
                        <Badge variant="outline">{currentLevel} / 5</Badge>
                      </div>

                      {/* 1 to 5 selector */}
                      <div className="grid grid-cols-5 gap-1.5 mt-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setSelectedSkillLevels({ ...selectedSkillLevels, [skill.id]: level })
                            }
                            className={`py-1.5 rounded text-xs font-semibold transition-colors ${
                              currentLevel === level
                                ? 'bg-[#C2410C] text-white shadow-sm'
                                : 'bg-secondary text-secondary-foreground hover:bg-muted'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Learning Preferences & Time Allocation */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Preferred Language */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground/80">
                  Preferred Learning Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferredLanguage('en')}
                    className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                      preferredLanguage === 'en'
                        ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-[#C2410C]" />
                    <span>English (Global)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredLanguage('hi')}
                    className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                      preferredLanguage === 'hi'
                        ? 'border-[#C2410C] bg-[#C2410C]/10 text-[#C2410C]'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-[#C2410C]" />
                    <span>हिन्दी (Hindi / Hinglish)</span>
                  </button>
                </div>
              </div>

              {/* Weekly Study Hours */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                    Available Study Time per Week
                  </label>
                  <span className="font-bold text-sm text-[#C2410C]">{weeklyStudyHours} hours/week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="2"
                  value={weeklyStudyHours}
                  onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value, 10))}
                  className="w-full accent-[#C2410C] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Casual (4 hrs)</span>
                  <span>Moderate (12 hrs)</span>
                  <span>Intensive (30+ hrs)</span>
                </div>
              </div>

              {/* Learning Style Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground/80">
                  Preferred Learning Modalities
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Hands-on Projects',
                    'Interactive Quizzes',
                    'Official Documentation',
                    'Video Lectures',
                    'AI Pair Mentoring',
                    'Free Certified Courses'
                  ].map((modality) => {
                    const isSelected = learningPreferences.includes(modality);
                    return (
                      <button
                        key={modality}
                        type="button"
                        onClick={() => togglePreference(modality)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-[#C2410C] text-white border-[#C2410C]'
                            : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {modality}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack} className="flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={handleNext} className="flex items-center gap-1.5 font-semibold">
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                isLoading={isSubmitting}
                className="flex items-center gap-1.5 font-semibold shadow-md px-6"
              >
                <Sparkles className="w-4 h-4" />
                Generate Skill Diagnostic
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
