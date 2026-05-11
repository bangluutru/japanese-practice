import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Language, Translations } from './translations';
import { translations } from './translations';

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'japanese-practice-sheet-lang';

function detectLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && (['en', 'ja', 'vi'] as Language[]).includes(stored)) return stored;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('vi')) return 'vi';
  return 'en';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
