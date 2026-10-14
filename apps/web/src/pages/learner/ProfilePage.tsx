import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { User, Briefcase, Globe, Clock, CheckCircle2, Award, Save } from 'lucide-react';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [education, setEducation] = useState(profile?.education || '');
  const [experienceYears, setExperienceYears] = useState(profile?.experienceYears || 0);
  const [currentRole, setCurrentRole] = useState(profile?.currentRole || '');
  const [targetRoleId, setTargetRoleId] = useState(profile?.targetRoleId || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>(
    (profile?.preferredLanguage as any) || 'en'
  );
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(profile?.weeklyStudyHours || 10);
  const [roles, setRoles] = useState<any[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile?.targetRoleId) {
      setTargetRoleId(profile.targetRoleId);
    }
  }, [profile?.targetRoleId]);

  useEffect(() => {
    apiClient<any[]>('/competency/roles')
      .then((data) => setRoles(data || []))
      .catch((err) => console.warn(err));

    apiClient<any>('/profile')
      .then((data) => {
        setUserSkills(data?.userSkills || []);
        if (data?.profile?.targetRoleId) {
          setTargetRoleId(data.profile.targetRoleId);
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await apiClient('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName,
          education,
          experienceYears: Number(experienceYears),
          currentRole: currentRole || undefined,
          targetRoleId: targetRoleId || undefined,
          preferredLanguage,
          weeklyStudyHours: Number(weeklyStudyHours)
        })
      });

      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
          Learner Settings
        </span>
        <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
          Profile & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your career targets, study pace, and competency portfolio.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Account Email"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Education / Degree"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
              <Input
                label="Years of Experience"
                type="number"
                min="0"
                max="30"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <Input
              label="Current Title / Role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Target Role & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1">Target Career Role</label>
              <select
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                className="w-full bg-secondary rounded-lg p-2.5 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
              >
                <option value="">-- Select a Target Role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.industryDemand} Demand)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                  className="w-full bg-secondary rounded-lg p-2.5 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Weekly Study Hours</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={weeklyStudyHours}
                  onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value, 10) || 10)}
                  className="w-full bg-secondary rounded-lg p-2 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <Button type="submit" isLoading={isSaving} className="flex items-center gap-1.5 font-semibold">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Competencies Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center justify-between">
              <span>Competency Skill Portfolio</span>
              <span className="text-xs font-sans text-muted-foreground font-normal">
                {userSkills.length} Recorded Skills
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userSkills.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No verified skills recorded yet. Complete onboarding or take diagnostic assessments.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userSkills.map((us) => (
                  <div key={us.id} className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5 flex-wrap">
                        <span>{us.skillName}</span>
                        {(us.needsConfirmation || (us.selfAssessedLevel > (us.verifiedScore ?? 0))) && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                            ({t('dashboard.retakePrompt', { defaultValue: 'Retake the diagnostic to confirm' })})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {us.verifiedScore !== null && us.verifiedScore !== undefined
                          ? `Self: ${us.selfAssessedLevel}/5 • Verified: ${us.verifiedScore}/5`
                          : 'Not assessed'}
                      </div>
                    </div>
                    <Badge variant={us.verifiedScore !== null && us.verifiedScore !== undefined ? 'success' : 'neutral'}>
                      {us.verifiedScore !== null && us.verifiedScore !== undefined
                        ? `Level ${us.effectiveScore}/5`
                        : 'Not assessed'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
