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
  });
});
