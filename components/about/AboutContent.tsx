'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutContent() {
  const { t, language } = useLanguage();

  const isTamil = language === 'ta';

  const defaultGoals = [
    'அல்-குர்ஆனை மனனம் செய்து அதற்கு பணிவிடை செய்யும் ஒரு பரம்பரையை உருவாக்கல்.',
    'அல்-குர்ஆனிய அறிவைப் பெற்ற பல்துறை சார்ந்த ஆளுமைகளை உருவாக்கல்.',
    'ஆன்மீக மற்றும் பண்பாட்டு ரீதியாக பயிற்றுவிக்கப்பட்ட ஆளுமைகளை உருவாக்கல்.',
    'நடுநிலைமை மற்றும் முழுமைத்தன்மை ஆகிய பண்புகளைஅடிப்படையாகக் கொண்டு இஸ்லாமிய சிந்தனையைப் பரப்புதல்.',
    'தீனுக்கும் சமூகத்திற்கும் நற்பணி புரியும் சாலிஹான பிரஜைகளை உருவாக்கல்.',
    'இலங்கையின் பொதுக்கல்வியின் இலக்குகளை அடைந்து தேசிய தொழில் தகைமைகளை அடைவதற்கான வழிகாட்டல்.',
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.about.hero.subtitle', 'Our Story')}</span>
          <h1>{t('pages.about.hero.title', 'About the Institute')}</h1>
          <p>{t('pages.about.hero.copy', 'A journey of faith, dedication, and the pursuit of Quranic excellence.')}</p>
          <div className="hero-btns" style={{ marginTop: '2rem' }}>
            <Link href="/management" className="btn btn-primary">
              {t('pages.about.hero.cta', 'Meet Our Management')}
            </Link>
          </div>
        </div>
      </section>

      {/* Motto, Vision & Mission */}
      <section className="section-container">
        <div className="grid-container" style={{ gap: '2rem' }}>
          {/* Motto Card */}
          <div className="about-feature-card card-gold">
            <div className="card-icon card-icon-gold">
              <i className="fa-solid fa-quote-left"></i>
            </div>
            <h3 className="about-card-title">
              {t('pages.about.cards.0.title', isTamil ? 'மகுட வாசகம்' : 'Motto')}
            </h3>
            <span className="about-card-subtitle subtitle-gold">
              (MOTTO)
            </span>
            <p className="about-card-text motto-text">
              {t(
                'pages.about.cards.0.copy',
                isTamil
                  ? 'புனித அல்-குர்ஆனை செம்மையாகவும் முழுமையாகவும் மனனம் செய்வோம்'
                  : 'Let us memorize the Holy Quran accurately and completely.'
              )}
            </p>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                marginTop: '0.6rem',
                lineHeight: 1.4,
                fontFamily: isTamil ? 'inherit' : "'Arima Madurai', cursive, serif",
                fontStyle: isTamil ? 'italic' : 'normal',
                opacity: 0.9,
              }}
            >
              <span translate="no" className="notranslate" lang={isTamil ? 'en' : 'ta'}>
                {isTamil
                  ? '"Let us memorize the Holy Quran accurately and completely."'
                  : '"புனித அல்-குர்ஆனை செம்மையாகவும் முழுமையாகவும் மனனம் செய்வோம்"'}
              </span>
            </p>
          </div>

          {/* Vision Card */}
          <div className="about-feature-card card-emerald">
            <div className="card-icon card-icon-emerald">
              <i className="fa-solid fa-eye"></i>
            </div>
            <h3 className="about-card-title">
              {t('pages.about.cards.1.title', 'தூர நோக்கு')}
            </h3>
            {isTamil && (
              <span className="about-card-subtitle subtitle-emerald">
                (VISION)
              </span>
            )}
            <p className="about-card-text">
              {t(
                'pages.about.cards.1.copy',
                'அல்-குர்ஆனை சுமந்த பல்துறைசார் முன்மாதிரி ஆளுமைகளை உருவாக்கும் தனித்துவமான கலாபீடம்'
              )}
            </p>
          </div>

          {/* Mission Card */}
          <div className="about-feature-card card-gold">
            <div className="card-icon card-icon-gold">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <h3 className="about-card-title">
              {t('pages.about.cards.2.title', 'பணிக்கூற்று')}
            </h3>
            {isTamil && (
              <span className="about-card-subtitle subtitle-gold">
                (MISSION)
              </span>
            )}
            <p className="about-card-text">
              {t(
                'pages.about.cards.2.copy',
                'பொருத்தமான வழிமுறைகள் மூலம் எமது சமூகத்திற்கும் நாட்டிற்கும் பணிவிடைசெய்யக் கூடிய. அல் குர்ஆனை மனனம் செய்த நற்பண்புடைய ஒரு பரம்பரையை உருவாக்குதல்'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Detailed About Section */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="section-container">
          <div className="responsive-grid">
            <div>
              <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
                {t('pages.about.legacy.subtitle', t('pages.about.story.subtitle', 'Our Story'))}
              </span>
              <h2 className="section-title" style={{ textAlign: 'left', marginTop: '1rem', marginBottom: '2rem' }}>
                {t('pages.about.legacy.title', t('pages.about.story.title', 'A Legacy of Faith & Excellence'))}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.75 }}>
                {t(
                  'pages.about.legacy.copyOne',
                  t(
                    'pages.about.story.copy1',
                    'Founded with a divine vision, the Institute of Da\'wa Islamiyya has been a beacon of light for students seeking to memorize the Holy Quran while developing a character that reflects its teachings.'
                  )
                )}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {t(
                  'pages.about.legacy.copyTwo',
                  t(
                    'pages.about.story.copy2',
                    'We believe that Hifz is not just about memorization, but about building a deep, spiritual connection with the words of Allah (SWT) and implementing them in daily life through refined Akhlaq and academic excellence.'
                  )
                )}
              </p>
            </div>
            <div
              style={{
                background: 'white',
                padding: '3rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', marginBottom: '2rem' }}>
                {t('pages.about.legacy.valuesTitle', t('pages.about.values.title', 'Our Core Values'))}
              </h3>
              <ul className="footer-links" style={{ color: 'var(--text-primary)', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 600, fontSize: '1.05rem' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}></i>{' '}
                  {t('pages.about.legacy.values.0', 'Sincerity (Ikhlas)')}
                </li>
                <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 600, fontSize: '1.05rem' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}></i>{' '}
                  {t('pages.about.legacy.values.1', 'Excellence (Ihsan)')}
                </li>
                <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 600, fontSize: '1.05rem' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}></i>{' '}
                  {t('pages.about.legacy.values.2', 'Discipline (Adab)')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section
        className="section-container"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="section-title-wrapper" style={{ textAlign: 'center', marginBottom: isTamil ? '1.5rem' : '3rem' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: isTamil ? '0.5rem' : '0' }}>
            {t('pages.about.goals.title', 'இலக்குகள்')}
          </h2>
          {isTamil && (
            <span
              className="subtitle"
              style={{
                display: 'block',
                textAlign: 'center',
                color: 'var(--accent-emerald)',
                fontWeight: 700,
                letterSpacing: '2.5px',
                marginBottom: '2rem',
              }}
            >
              (GOALS)
            </span>
          )}
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ul className="goal-list">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <li key={index} className="goal-item">
                <div className="goal-icon-wrapper">
                  <i className="fa-solid fa-star-and-crescent goal-icon"></i>
                </div>
                <p className="goal-text">
                  {t(`pages.about.goals.items.${index}`, defaultGoals[index])}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
