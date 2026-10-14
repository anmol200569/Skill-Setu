import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Briefcase,
  Search,
  Sliders
} from 'lucide-react';

export function CompetencyManagerPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'skills' | 'domains'>('roles');
  const [roles, setRoles] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleDemand, setRoleDemand] = useState('High');

  useEffect(() => {
    loadCompetencyData();
  }, []);

  const loadCompetencyData = async () => {
    setIsLoading(true);
    try {
      const [r, s, d] = await Promise.all([
        apiClient<any[]>('/competency/roles'),
        apiClient<any[]>('/competency/skills'),
        apiClient<any[]>('/competency/domains')
      ]);
      setRoles(r || []);
      setSkills(s || []);
      setDomains(d || []);
    } catch (err: any) {
      console.warn('Competency data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle || !roleCode) return;

    try {
      await apiClient('/competency/roles', {
        method: 'POST',
        body: JSON.stringify({
          code: roleCode,
          title: roleTitle,
          description: roleDescription || 'Professional technology career track.',
          industryDemand: roleDemand,
          skills: skills.slice(0, 4).map((s) => ({
            skillId: s.id,
            requiredProficiency: 3,
            priority: 'must_have',
            weight: 1.0
          }))
        })
      });

      setIsRoleModalOpen(false);
      setRoleTitle('');
      setRoleCode('');
      setRoleDescription('');
      await loadCompetencyData();
    } catch (err: any) {
      alert('Failed to create role: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Framework Governance
          </span>
          <h1 className="text-3xl font-sans font-bold text-foreground mt-1">
            Competency Framework Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure domains, skill taxonomies, roles, and 1-5 proficiency thresholds.
          </p>
        </div>

        <Button onClick={() => setIsRoleModalOpen(true)} className="flex items-center gap-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          Add Career Role
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 ${
            activeTab === 'roles'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Career Roles ({roles.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 ${
            activeTab === 'skills'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Skills ({skills.length})
        </button>
        <button
          onClick={() => setActiveTab('domains')}
          className={`pb-3 ${
            activeTab === 'domains'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Domains ({domains.length})
        </button>
      </div>

      {/* Content based on Active Tab */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-card border border-border" />
          ))}
        </div>
      ) : activeTab === 'roles' ? (
        <div className="space-y-4">
          {roles.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground text-sm">
              No career roles configured yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold">{role.title}</CardTitle>
                      <Badge variant="outline">{role.industryDemand} Demand</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{role.description}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Required Competencies (Thresholds)
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {role.skillsRequired?.map((req: any) => (
                        <div
                          key={req.id}
                          className="p-2.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-foreground">{req.skill?.name || 'Skill'}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              Weight: {req.weight}x
                            </span>
                            <Badge variant="neutral">Level {req.requiredProficiency}/5</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'skills' ? (
        skills.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground text-sm">
            No skills configured yet.
          </Card>
        ) : (
          <div className="bg-card rounded-xl border border-border divide-y divide-border text-xs">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-foreground">{skill.name}</div>
                  <div className="text-muted-foreground mt-0.5">
                    Category: {skill.category} • Domain: {skill.domain?.name || 'General'}
                  </div>
                </div>
                <Badge variant="outline">{skill.code}</Badge>
              </div>
            ))}
          </div>
        )
      ) : (
        domains.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground text-sm">
            No domains configured yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((dom) => (
              <Card key={dom.id}>
                <CardHeader>
                  <CardTitle className="text-base font-bold">{dom.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{dom.description}</p>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{dom.skills?.length || 0} Skills Configured</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Add Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Add New Career Role"
        className="max-w-md"
      >
        <form onSubmit={handleCreateRole} className="space-y-4 py-2">
          <Input
            label="Role Title"
            placeholder="e.g. Cloud Solutions Architect"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
          />
          <Input
            label="Unique Code"
            placeholder="e.g. cloud-arch"
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value)}
          />
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/80">Role Description</label>
            <textarea
              rows={3}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Detailed description of primary duties..."
              className="w-full bg-secondary rounded-xl p-2.5 text-xs border border-border focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/80">Market Demand</label>
            <select
              value={roleDemand}
              onChange={(e) => setRoleDemand(e.target.value)}
              className="w-full bg-secondary rounded-xl p-2 text-xs border border-border focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            >
              <option value="Moderate">Moderate Demand</option>
              <option value="High">High Demand</option>
              <option value="Very High">Very High Demand</option>
              <option value="Critical">Critical Demand</option>
            </select>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" className="font-semibold">
              Save Role
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
