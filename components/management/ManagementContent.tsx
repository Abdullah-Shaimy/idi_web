'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagementContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.management.hero.subtitle', 'Our Team')}</span>
          <h1>{t('pages.management.hero.title', 'The Management')}</h1>
          <p>
            {t(
              'pages.management.hero.copy',
              'The dedicated visionaries guiding the spiritual and academic journey of our students.'
            )}
          </p>
        </div>
      </section>

      {/* Management Team */}
      <section className="section-container">
        <div className="section-title-wrapper">
          <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
            {t('pages.management.leadership.subtitle', 'Leadership')}
          </span>
          <h2 className="section-title">
            {t('pages.management.leadership.title', 'Guiding Lights')}
          </h2>
        </div>

        <div className="grid-container">
          {/* Principal */}
          <div className="card mgmt-card">
            <div className="mgmt-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Sheikh Abdullah Hasan"
                className="mgmt-img"
                loading="lazy"
              />
            </div>
            <span className="mgmt-role">
              {t('pages.management.team.0.role', 'Principal & Head of Hifz')}
            </span>
            <h3 className="mgmt-name">
              {t('pages.management.team.0.name', 'Sheikh Abdullah Hasan')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {t(
                'pages.management.team.0.copy',
                'Leading the institution with over 25 years of experience in Quranic sciences and educational management.'
              )}
            </p>
          </div>

          {/* Vice Principal */}
          <div className="card mgmt-card">
            <div className="mgmt-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Ustaz Tariq Jameel"
                className="mgmt-img"
                loading="lazy"
              />
            </div>
            <span className="mgmt-role">
              {t('pages.management.team.1.role', 'Vice Principal & Tajweed Expert')}
            </span>
            <h3 className="mgmt-name">
              {t('pages.management.team.1.name', 'Ustaz Tariq Jameel')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {t(
                'pages.management.team.1.copy',
                'Ensuring the highest standards of Qira\'at and managing the daily spiritual curriculum of the students.'
              )}
            </p>
          </div>

          {/* Administrator */}
          <div className="card mgmt-card">
            <div className="mgmt-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Brother Umar Farooq"
                className="mgmt-img"
                loading="lazy"
              />
            </div>
            <span className="mgmt-role">
              {t('pages.management.team.2.role', 'Chief Administrator')}
            </span>
            <h3 className="mgmt-name">
              {t('pages.management.team.2.name', 'Brother Umar Farooq')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {t(
                'pages.management.team.2.copy',
                'Managing student affairs, admissions, and ensuring the facility provides a serene environment for learning.'
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
