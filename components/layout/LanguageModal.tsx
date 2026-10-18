'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageModal() {
  const { showModal, setShowModal, setLanguage, language, t } = useLanguage();

  if (!showModal) return null;

  const handleSelect = (lang) => {
    setLanguage(lang, true);
    setShowModal(false);
  };

  return (
    <div
      className="language-modal-overlay active"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowModal(false);
        }
      }}
    >
      <div
        className="language-modal-card"
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '480px',
          width: '100%',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setShowModal(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>

        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-emerald-faint)',
            color: 'var(--accent-emerald)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: '1.25rem',
          }}
        >
          <i className="fa-solid fa-globe"></i>
        </div>

        <h3
          className="language-modal-title"
          style={{
            fontSize: '1.5rem',
            marginBottom: '0.6rem',
            color: 'var(--text-primary)',
          }}
        >
          {t('common.modal.title', 'Choose your language')}
        </h3>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {t(
            'common.modal.copy',
            'Select how you would like to explore the Institute website. Your choice will be saved for the next visit.'
          )}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            type="button"
            className={`btn ${language === 'en' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              padding: '1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => handleSelect('en')}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {t('common.modal.englishTitle', 'English')}
            </span>
            <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
              {t('common.modal.englishCopy', 'Continue in English')}
            </span>
          </button>

          <button
            type="button"
            className={`btn ${language === 'ta' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              padding: '1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => handleSelect('ta')}
          >
            <span translate="no" className="notranslate" lang="ta" style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {t('common.modal.tamilTitle', 'தமிழ்')}
            </span>
            <span translate="no" className="notranslate" lang="ta" style={{ fontSize: '0.75rem', opacity: 0.85 }}>
              {t('common.modal.tamilCopy', 'தமிழில் தொடரவும்')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
