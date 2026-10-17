'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function HifzContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.hifz.hero.subtitle', 'Our Program')}</span>
          <h1>{t('pages.hifz.hero.title', 'Tahfeez-ul-Quran')}</h1>
          <p>
            {t(
              'pages.hifz.hero.copy',
              'A systematic and spiritual approach to memorizing the Holy Quran with perfect Tajweed.'
            )}
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-container">
        <div className="section-title-wrapper">
          <span className="subtitle">{t('pages.hifz.curriculum.subtitle', 'The Journey')}</span>
          <h2 className="section-title">{t('pages.hifz.curriculum.title', 'Our Curriculum')}</h2>
        </div>
        <div className="grid-container">
          <div className="card">
            <div className="card-icon">
              <i className="fa-solid fa-star-and-crescent"></i>
            </div>
            <h3 className="card-title">{t('pages.hifz.cards.0.title', 'Nazira & Tajweed')}</h3>
            <p className="card-text">
              {t(
                'pages.hifz.cards.0.copy',
                'Developing fluent reading with precise articulation (Makharij) and understanding the rules of Tajweed before starting memorization.'
              )}
            </p>
          </div>
          <div className="card">
            <div className="card-icon">
              <i className="fa-solid fa-repeat"></i>
            </div>
            <h3 className="card-title">{t('pages.hifz.cards.1.title', 'Daily Sabak & Dour')}</h3>
            <p className="card-text">
              {t(
                'pages.hifz.cards.1.copy',
                'Students learn new portions daily and revise previous lessons as Sabak. Final revision (Dour) is done to ensure long-term retention.'
              )}
            </p>
          </div>
          <div className="card">
            <div className="card-icon">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <h3 className="card-title">{t('pages.hifz.cards.2.title', 'Takmeel & Revision')}</h3>
            <p className="card-text">
              {t(
                'pages.hifz.cards.2.copy',
                'Final consolidation of the entire 30 Juz, followed by rigorous testing and certification as a Hafiz-ul-Quran.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="section-container">
          <div className="responsive-grid">
            <div className="card" style={{ border: 'none', background: 'white', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-emerald)' }}>
                {t('pages.hifz.levels.title', 'Levels of Study')}
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {t(
                  'pages.hifz.levels.intro',
                  'The memorization program is arranged across 6 levels, progressing through four academic years.'
                )}
              </p>
              <ul className="footer-links" style={{ color: 'var(--text-primary)' }}>
                <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>01.</span>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>
                      {t('pages.hifz.levels.items.0.title', 'First Year')}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      {t('pages.hifz.levels.items.0.copy', '05 Juz - Level 01')}
                    </p>
                  </div>
                </li>
                <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>02.</span>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>
                      {t('pages.hifz.levels.items.1.title', 'Second Year')}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      {t('pages.hifz.levels.items.1.copy', '10 Juz - Levels 02 and 03')}
                    </p>
                  </div>
                </li>
                <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>03.</span>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>
                      {t('pages.hifz.levels.items.2.title', 'Third Year')}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      {t('pages.hifz.levels.items.2.copy', '15 Juz - Levels 04, 05 and 06')}
                    </p>
                  </div>
                </li>
                <li style={{ marginBottom: 0, display: 'flex', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>04.</span>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>
                      {t('pages.hifz.levels.items.3.title', 'Fourth Year')}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      {t('pages.hifz.levels.items.3.copy', 'Doura - Revision 3 times')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--accent-emerald)' }}>
                {t('pages.hifz.typicalDay.title', 'A Typical Day')}
              </h3>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                {t(
                  'pages.hifz.typicalDay.copy',
                  'Our schedule is designed to optimize focus during early morning hours while providing sufficient rest and spiritual reflection throughout the day.'
                )}
              </p>
              <Link href="/students" className="btn btn-outline">
                {t('pages.hifz.typicalDay.cta', 'Explore the Journey')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
