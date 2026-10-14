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

