import { describe, it, expect } from 'vitest';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

describe('Internationalization Translation Dictionaries', () => {
  it('contains matched translation keys between English and Hindi', () => {
    expect(en.nav.dashboard).toBe('Dashboard');
    expect(hi.nav.dashboard).toBe('डैशबोर्ड');

    expect(en.nav.assessments).toBe('Assessments');
    expect(hi.nav.assessments).toBe('कौशल मूल्यांकन');

    expect(en.landing.title).toBeDefined();
    expect(hi.landing.title).toBeDefined();
    expect(en.landing.heroTitle).toBeDefined();
    expect(hi.landing.heroTitle).toBeDefined();
    expect(en.landing.wizard.title).toBeDefined();
    expect(hi.landing.wizard.title).toBeDefined();

    expect(en.auth.login.title).toBe('Welcome back to Skill Setu');
    expect(hi.auth.login.title).toBe('स्किल सेतु में आपका पुनः स्वागत है');
    expect(en.auth.signup.title).toBe('Create your Skill Setu account');
    expect(hi.auth.signup.title).toBe('अपना स्किल सेतु खाता बनाएं');

    expect(en.quiz.title).toBe('AI Quiz Generator');
    expect(hi.quiz.title).toBe('AI क्विज़ जनरेटर');

    // Dashboard parity
    expect(en.dashboard.readiness.title).toBeDefined();
    expect(hi.dashboard.readiness.title).toBeDefined();
    expect(en.dashboard.topGaps.title).toBeDefined();
    expect(hi.dashboard.topGaps.title).toBeDefined();
    expect(en.dashboard.skillGapPanel.title).toBeDefined();
    expect(hi.dashboard.skillGapPanel.title).toBeDefined();

    // Skill Gaps page parity
    expect(en.skillGapsPage.title).toBeDefined();
    expect(hi.skillGapsPage.title).toBeDefined();
    expect(en.skillGapsPage.changeRole).toBeDefined();
    expect(hi.skillGapsPage.changeRole).toBeDefined();

    // Roadmap and Courses parity
    expect(en.roadmapPage.title).toBeDefined();
    expect(hi.roadmapPage.title).toBeDefined();
    expect(en.coursesPage.title).toBeDefined();
    expect(hi.coursesPage.title).toBeDefined();

    // Landing 3D constellation parity
    expect(en.landing.constellation.tag).toBeDefined();
    expect(hi.landing.constellation.tag).toBeDefined();
    expect(en.landing.constellation.interactive).toBeDefined();
    expect(hi.landing.constellation.interactive).toBeDefined();
  });

  it('contains the correct dashboard tagline in English and Hindi', () => {
    expect(en.dashboard.tagline).toBe('Find Your Gap. Build Your Future.');
    expect(hi.dashboard.tagline).toBe('अपना कौशल अंतराल खोजें। अपना भविष्य बनाएं।');
  });

  it('contains all required layout and navigation keys with correct translations', () => {
    expect(en.nav.courses).toBe('Courses');
    expect(hi.nav.courses).toBe('पाठ्यक्रम');

    expect(en.nav.categories).toBe('Categories');
    expect(hi.nav.categories).toBe('श्रेणियाँ');

    expect(en.nav.whySkillSetu).toBe('Why Skill-Setu');
    expect(hi.nav.whySkillSetu).toBe('स्किल-सेतु क्यों');

    expect(en.nav.aiCareerDiagnostic).toBe('AI Career Diagnostic');
    expect(hi.nav.aiCareerDiagnostic).toBe('एआई करियर डायग्नोस्टिक');

    expect(en.nav.switchToHindi).toBe('हिन्दी में बदलें');
    expect(hi.nav.switchToEnglish).toBe('Switch to English');

    expect(en.nav.searchPlaceholder).toBe('Search courses & skills...');
    expect(hi.nav.searchPlaceholder).toBe('पाठ्यक्रम और कौशल खोजें...');

    expect(en.breadcrumbs.label).toBe('Breadcrumbs');
    expect(hi.breadcrumbs.label).toBe('ब्रेडक्रंब');

    expect(en.mentor.askMentor).toBe('Ask AI Mentor');
    expect(hi.mentor.askMentor).toBe('एआई मेंटर से पूछें');
    // Hero real facts, resources card, and checklist card parity
    expect(en.landing.hero.facts.roles).toBe('6 Target Career Roles');
    expect(hi.landing.hero.facts.roles).toBe('6 लक्षित करियर भूमिकाएं');
    expect(en.landing.hero.resourceCard.title).toBe('61 Free Courses • 5 Providers');
    expect(hi.landing.hero.resourceCard.title).toBe('61 मुफ़्त पाठ्यक्रम • 5 प्रदाता');
    expect(en.landing.hero.checklist.title).toBe('Built-in Platform Features');
    expect(hi.landing.hero.checklist.title).toBe('प्लेटफ़ॉर्म की वास्तविक सुविधाएं');
  });

  it('ensures en.json and hi.json contain no banned marketing terms, fake personas, or fabricated stats', () => {
    const bannedPatterns = [
      'Alex Rivera',
      'Jamie Chen',
      'Taylor Kim',
      'Morgan Lee',
      'Priya S',
      'James T',
      'Maria L',
      '500+',
      '20,000',
      'thousands',
      '$49',
      '$59',
      'Free on Setu',
      'expert',
      'lifetime',
      'certificate',
      'career support',
      'world-class',
      'verified'
    ];

    const enStr = JSON.stringify(en).toLowerCase();
    const hiStr = JSON.stringify(hi).toLowerCase();

    for (const pattern of bannedPatterns) {
      const lower = pattern.toLowerCase();
      expect(enStr.includes(lower), `en.json contains banned term: "${pattern}"`).toBe(false);
      expect(hiStr.includes(lower), `hi.json contains banned term: "${pattern}"`).toBe(false);
    }
  });

  it('guarantees complete recursive key parity between en.json and hi.json', () => {
    function getKeys(obj: Record<string, any>, prefix = ''): string[] {
      let keys: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          keys = keys.concat(getKeys(value, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }

    const enKeys = new Set(getKeys(en));
    const hiKeys = new Set(getKeys(hi));

    const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
    const missingInEn = [...hiKeys].filter((k) => !enKeys.has(k));

    expect(missingInHi, `Keys present in en.json but missing in hi.json: ${missingInHi.join(', ')}`).toEqual([]);
    expect(missingInEn, `Keys present in hi.json but missing in en.json: ${missingInEn.join(', ')}`).toEqual([]);
  });
});

