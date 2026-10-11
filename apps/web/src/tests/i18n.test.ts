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

    expect(en.quiz.title).toBe('AI Quiz Generator');
    expect(hi.quiz.title).toBe('AI क्विज़ जनरेटर');
  });
});
