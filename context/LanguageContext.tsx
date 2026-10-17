'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getText,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  formatOrigin as libFormatOrigin,
  formatGraduateName as libFormatGraduateName,
  translateSubject as libTranslateSubject,
  translateExam as libTranslateExam,
  translateClassName as libTranslateClassName,
} from '../lib/i18nData';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [showModal, setShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('idi_language');
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      } else {
        setShowModal(true);
      }
    } catch (e) {
      // ignore localStorage errors
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = useCallback((newLang, persist = true) => {
    const validLang = SUPPORTED_LANGUAGES.includes(newLang) ? newLang : DEFAULT_LANGUAGE;
    setLanguageState(validLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = validLang;
    }
    if (persist) {
      try {
        localStorage.setItem('idi_language', validLang);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const t = useCallback((path, fallback = '') => {
    return getText(path, language, fallback);
  }, [language]);

  const formatOrigin = useCallback((text) => {
    return libFormatOrigin(text, language);
  }, [language]);

  const formatGraduateName = useCallback((name) => {
    return libFormatGraduateName(name, language);
  }, [language]);

  const translateSubject = useCallback((subject) => {
    return libTranslateSubject(subject, language);
  }, [language]);

  const translateExam = useCallback((exam) => {
    return libTranslateExam(exam, language);
  }, [language]);

  const translateClassName = useCallback((className) => {
    return libTranslateClassName(className, language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatOrigin,
        formatGraduateName,
        translateSubject,
        translateExam,
        translateClassName,
        showModal,
        setShowModal,
        isInitialized,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
