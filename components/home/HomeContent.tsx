'use client';

import React from 'react';
import Link from 'next/link';
import HeroSlider from './HeroSlider';
import { useLanguage } from '../../context/LanguageContext';

export default function HomeContent() {
  const { t, language, formatOrigin, formatGraduateName } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <>
      {/* Hero Section */}
      <HeroSlider />

      {/* 1. Short Version: About the Institute */}
      <section className="section-container home-section-pad" id="home-about">
        <div className="responsive-grid" style={{ alignItems: 'center', gap: '4rem' }}>
          <div className="home-about-media" style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)',
              }}
            >
              <img
                src="/assets/images/about_hero.webp"
                alt="Institute of Da'wa Islamiyya Campus"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
            <div
              className="home-about-badge"
              style={{
                position: 'absolute',
                bottom: '-1.25rem',
                right: '1.5rem',
                background: 'var(--accent-emerald-dark)',
                color: 'white',
                padding: '0.9rem 1.6rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '2px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
              }}
            >
              <i className="fa-solid fa-award" style={{ fontSize: '1.8rem', color: 'var(--accent-gold)' }}></i>
              <div>
                <strong style={{ display: 'block', fontSize: '1.05rem', lineHeight: 1.2 }}>
                  {t('pages.index.homeAbout.badgeTitle', 'Since 1987')}
                </strong>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {t('pages.index.homeAbout.badgeSubtitle', 'Preserving the Quran')}
                </span>
              </div>
            </div>
          </div>

          <div className="home-about-text">
            <span className="subtitle home-about-sub" style={{ color: 'var(--accent-emerald)' }}>
              {t('pages.index.homeAbout.subtitle', 'About the Institute')}
            </span>
            <h2
              className="section-title home-about-title"
              style={{ textAlign: 'left', marginTop: '0.75rem', marginBottom: '1.5rem' }}
            >
              {t('pages.index.homeAbout.title', 'Nurturing Faith, Knowledge & Character')}
            </h2>
            <p
              className="home-about-copy"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}
            >
              {t(
                'pages.index.homeAbout.copy',
                "The Institute of Da'wa Islamiyya (IDI) is a center of excellence dedicated to Qur'anic memorization (Hifz), sound Islamic scholarship, and character development. We provide an inspiring sanctuary where students connect deeply with the words of Allah (SWT) and embody them through refined ethics."
              )}
            </p>
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderLeft: '4px solid var(--accent-gold)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  color: 'var(--accent-gold)',
                  display: 'block',
                  marginBottom: '0.3rem',
                }}
              >
                {t('pages.index.homeAbout.mottoLabel', 'Institution Motto')}
              </span>
              <p
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.4,
                  fontFamily: isTamil ? "'Arima Madurai', cursive, serif" : 'inherit',
                }}
              >
                {t(
                  'pages.index.homeAbout.mottoQuote',
                  isTamil
                    ? '"புனித அல்-குர்ஆனை செம்மையாகவும் முழுமையாகவும் மனனம் செய்வோம்"'
                    : '"Let us memorize the Holy Quran accurately and completely."'
                )}
              </p>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)',
                  margin: '0.35rem 0 0',
                  lineHeight: 1.4,
                  fontFamily: isTamil ? 'inherit' : "'Arima Madurai', cursive, serif",
                  fontStyle: isTamil ? 'italic' : 'normal',
                }}
              >
                {isTamil
                  ? t('pages.index.homeAbout.mottoQuoteEn', '"Let us memorize the Holy Quran accurately and completely."')
                  : t('pages.index.homeAbout.mottoQuoteTa', '"புனித அல்-குர்ஆனை செம்மையாகவும் முழுமையாகவும் மனனம் செய்வோம்"')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i> {t('pages.index.homeAbout.values.0', 'Sincerity (Ikhlas)')}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i> {t('pages.index.homeAbout.values.1', 'Excellence (Ihsan)')}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i> {t('pages.index.homeAbout.values.2', 'Discipline (Adab)')}
              </div>
            </div>
            <div>
              <Link href="/about" className="btn btn-primary home-about-cta">
                {t('pages.index.homeAbout.cta', 'Discover More About Us')} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features / Foundation */}
      <section className="section-container" id="home-foundation">
        <div className="section-title-wrapper">
          <span className="subtitle">{t('pages.index.foundation.subtitle', 'Our Foundation')}</span>
          <h2 className="section-title">{t('pages.index.foundation.title', 'A Tradition of Excellence')}</h2>
        </div>
        <div className="grid-container" id="home-foundation-cards">
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-book-quran"></i></div>
            <h3 className="card-title">{t('pages.index.cards.0.title', 'Hifz Program')}</h3>
            <p className="card-text">{t('pages.index.cards.0.copy', 'Comprehensive memorization of the Holy Quran with perfect Tajweed and focused Tarbiyah for every student.')}</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-mosque"></i></div>
            <h3 className="card-title">{t('pages.index.cards.1.title', 'Islamic Studies')}</h3>
            <p className="card-text">{t('pages.index.cards.1.copy', 'Deep dive into Fiqh, Hadith, and Seerah, providing a solid foundation of Islamic knowledge alongside Hifz.')}</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-heart-circle-check"></i></div>
            <h3 className="card-title">{t('pages.index.cards.2.title', 'Holistic Tarbiyah')}</h3>
            <p className="card-text">{t('pages.index.cards.2.copy', 'Nurturing character (Akhlaq) and ethics through personalized mentorship and a spiritual environment.')}</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
            <h3 className="card-title">{t('pages.index.cards.3.title', 'School Studies')}</h3>
            <p className="card-text">{t('pages.index.cards.3.copy', 'Comprehensive academic support from Grade 6 to 11 (O/L), ensuring students maintain high educational standards alongside their Hifz journey.')}</p>
          </div>
        </div>
      </section>

      {/* 2. Short Version: Hifz Program */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
        }}
        className="home-section-pad"
        id="home-hifz"
      >
        <div className="section-container">
          <div className="section-title-wrapper" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="subtitle home-hifz-sub">
              {t('pages.index.homeHifz.subtitle', 'Tahfeez-ul-Quran')}
            </span>
            <h2 className="section-title home-hifz-title">
              {t('pages.index.homeHifz.title', 'Comprehensive Hifz Program')}
            </h2>
            <p
              className="home-hifz-copy"
              style={{ maxWidth: '650px', margin: '1rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              {t('pages.index.homeHifz.copy', 'A systematic, 4-year curriculum designed to ensure accurate recitation, steady memorization, and lifelong retention of the Holy Quran.')}
            </p>
          </div>
          <div className="grid-container" style={{ gap: '2rem', marginBottom: '3rem' }}>
            <div className="card home-card-hifz">
              <div className="card-icon"><i className="fa-solid fa-book-open-reader"></i></div>
              <h3 className="card-title">
                {t('pages.index.homeHifz.cards.0.title', '1. Nazira & Tajweed')}
              </h3>
              <p className="card-text">
                {t('pages.index.homeHifz.cards.0.copy', 'Mastery of correct pronunciation (Makharij) and complete Tajweed rules to ensure fluent, beautiful recitation before memorization begins.')}
              </p>
            </div>
            <div className="card home-card-hifz" style={{ borderTopColor: 'var(--accent-gold)' }}>
              <div className="card-icon" style={{ color: 'var(--accent-gold)' }}><i className="fa-solid fa-repeat"></i></div>
              <h3 className="card-title">
                {t('pages.index.homeHifz.cards.1.title', '2. Sabak & Dour System')}
              </h3>
              <p className="card-text">
                {t('pages.index.homeHifz.cards.1.copy', 'Daily new lesson memorization (Sabak) combined with systematic revision of recent portions (Sabki) and cumulative revision cycles (Dour).')}
              </p>
            </div>
            <div className="card home-card-hifz">
              <div className="card-icon"><i className="fa-solid fa-certificate"></i></div>
              <h3 className="card-title">
                {t('pages.index.homeHifz.cards.2.title', '3. Takmeel & Certification')}
              </h3>
              <p className="card-text">
                {t('pages.index.homeHifz.cards.2.copy', 'Complete consolidation of the entire 30 Juz with 3 rounds of Dawrah review, comprehensive testing, and formal certification as a Hafiz.')}
              </p>
            </div>
          </div>
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '2rem 2.5rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <i className="fa-solid fa-layer-group" style={{ fontSize: '1.6rem', color: 'var(--accent-emerald)' }}></i>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>
                    {t('pages.index.homeHifz.badges.0.title', '6 Progressive Stages')}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {t('pages.index.homeHifz.badges.0.sub', '5 Juz per Level')}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '1.6rem', color: 'var(--accent-gold)' }}></i>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>
                    {t('pages.index.homeHifz.badges.1.title', '4-Year Course')}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {t('pages.index.homeHifz.badges.1.sub', 'Systematic Progression')}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <i className="fa-solid fa-user-check" style={{ fontSize: '1.6rem', color: 'var(--accent-emerald)' }}></i>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>
                    {t('pages.index.homeHifz.badges.2.title', 'Personalized Mentorship')}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {t('pages.index.homeHifz.badges.2.sub', 'Individual Daily Tracking')}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Link href="/hifz" className="btn btn-outline home-hifz-cta">
                {t('pages.index.homeHifz.cta', 'Explore Hifz Curriculum')} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Short Version: Student Journey & Routine */}
      <section className="section-container home-section-pad" id="home-journey">
        <div className="responsive-grid" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <span className="subtitle home-journey-sub" style={{ color: 'var(--accent-emerald)' }}>
              {t('pages.index.homeJourney.subtitle', 'Student Journey')}
            </span>
            <h2 className="section-title home-journey-title" style={{ textAlign: 'left', marginTop: '0.75rem', marginBottom: '1.5rem' }}>
              {t('pages.index.homeJourney.title', 'A Harmonious Balance of Sacred & Secular Knowledge')}
            </h2>
            <p className="home-journey-copy" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {t('pages.index.homeJourney.copy', 'At IDI, intellectual growth and spiritual devotion flourish together. Along with rigorous Quranic memorization, our students receive standard national curriculum education from Grade 6 to Grade 11 (O/L), preparing well-rounded scholars with strong ethical character and academic competence.')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-emerald)' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                  <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent-emerald)', marginRight: '0.5rem' }}></i> {t('pages.index.homeJourney.features.0.title', 'Grade 6 to O/L')}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {t('pages.index.homeJourney.features.0.copy', 'Comprehensive national curriculum school education.')}
                </p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                  <i className="fa-solid fa-mosque" style={{ color: 'var(--accent-gold)', marginRight: '0.5rem' }}></i> {t('pages.index.homeJourney.features.1.title', 'Islamic Sciences')}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {t('pages.index.homeJourney.features.1.copy', 'Fiqh, Hadith, Seerah, and Arabic studies.')}
                </p>
              </div>
            </div>
            <div>
              <Link href="/students" className="btn btn-primary home-journey-cta">
                {t('pages.index.homeJourney.cta', 'Explore Student Journey')} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </Link>
            </div>
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '2.5rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-emerald)', margin: 0 }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: '0.5rem', color: 'var(--accent-gold)' }}></i> {t('pages.index.homeJourney.routineTitle', 'Daily Routine Highlights')}
                </h3>
                <span style={{ fontSize: '0.75rem', background: 'rgba(0, 109, 68, 0.1)', color: 'var(--accent-emerald)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 700 }}>
                  {t('pages.index.homeJourney.routineDays', 'Mon - Thu')}
                </span>
              </div>
              <div>
                <div className="home-routine-item">
                  <span className="home-routine-time" style={{ color: 'var(--accent-gold)' }}>
                    {t('pages.index.homeJourney.routine.0.time', '04:30 AM')}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>
                      {t('pages.index.homeJourney.routine.0.title', 'Wake up & Tahajjud')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {t('pages.index.homeJourney.routine.0.desc', 'Early rising and spiritual preparation for the day')}
                    </span>
                  </div>
                </div>
                <div className="home-routine-item">
                  <span className="home-routine-time" style={{ color: 'var(--accent-emerald)' }}>
                    {t('pages.index.homeJourney.routine.1.time', '05:15 AM')}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>
                      {t('pages.index.homeJourney.routine.1.title', 'Fajr & Morning Sabak')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {t('pages.index.homeJourney.routine.1.desc', 'Prime memorization hours with fresh, focused minds')}
                    </span>
                  </div>
                </div>
                <div className="home-routine-item">
                  <span className="home-routine-time" style={{ color: 'var(--accent-gold)' }}>
                    {t('pages.index.homeJourney.routine.2.time', '08:00 AM')}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>
                      {t('pages.index.homeJourney.routine.2.title', 'Academic Schooling')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {t('pages.index.homeJourney.routine.2.desc', 'Structured school subjects until 1:00 PM')}
                    </span>
                  </div>
                </div>
                <div className="home-routine-item">
                  <span className="home-routine-time" style={{ color: 'var(--accent-emerald)' }}>
                    {t('pages.index.homeJourney.routine.3.time', '04:15 PM')}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>
                      {t('pages.index.homeJourney.routine.3.title', 'Asr & Dour Revision')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {t('pages.index.homeJourney.routine.3.desc', 'Systematic cumulative revision for permanent retention')}
                    </span>
                  </div>
                </div>
                <div className="home-routine-item">
                  <span className="home-routine-time" style={{ color: 'var(--accent-gold)' }}>
                    {t('pages.index.homeJourney.routine.4.time', '06:30 PM')}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>
                      {t('pages.index.homeJourney.routine.4.title', 'Maghrib & Night Sabak')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {t('pages.index.homeJourney.routine.4.desc', 'Next day preparation followed by Isha & rest')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section: Why Choose IDI? */}
      <section className="bg-secondary" style={{ backgroundColor: 'var(--accent-emerald-dark)', color: 'white' }}>
        <div className="section-container responsive-grid">
          <div
            className="featured-img"
            style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
          >
            <img src="/assets/images/idi_face.webp" alt="Student Learning" />
          </div>
          <div className="featured-content">
            <span className="subtitle" style={{ color: 'var(--accent-gold-light)' }}>
              {t('pages.index.featured.subtitle', 'Join Us')}
            </span>
            <h2 className="section-title" style={{ marginBottom: '2rem', color: 'white' }}>
              {t('pages.index.featured.title', 'Why Choose IDI?')}
            </h2>
            <p style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.8)' }}>
              {t(
                'pages.index.featured.copy',
                'We provide a serene and disciplined environment that allows students to focus entirely on their connection with the Quran. Our experienced teachers guide each student at their own pace.'
              )}
            </p>
            <ul className="footer-links" style={{ marginBottom: '3rem' }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', marginBottom: '1rem' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold-light)' }}></i>
                  {t(`pages.index.featured.bullets.${i}`)}
                </li>
              ))}
            </ul>
            <Link
              href="/hifz"
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }}
            >
              {t('pages.index.featured.cta', 'Explore Programs')}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Short Version: Alumni */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
        }}
        className="home-section-pad"
        id="home-alumni"
      >
        <div className="section-container">
          <div className="section-title-wrapper" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="subtitle home-alumni-sub">
              {t('pages.index.homeAlumni.subtitle', 'Our Graduates')}
            </span>
            <h2 className="section-title home-alumni-title">
              {t('pages.index.homeAlumni.title', 'A Proud Legacy of Huffaz')}
            </h2>
            <p
              className="home-alumni-copy"
              style={{ maxWidth: '650px', margin: '1rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              {t('pages.index.homeAlumni.copy', 'Since 1987, dozens of dedicated students have graduated as certified Huffaz-ul-Quran, serving communities as spiritual leaders, imams, educators, and upright citizens.')}
            </p>
          </div>


          {/* Featured Alumni Cards */}
          <div className="home-alumni-grid">
            <div className="home-alumni-card">
              <div className="home-alumni-avatar-wrap">
                <img src="/assets/images/alumni_profile.webp" alt="Al Hafil Cms. Mohamed Fowsan" className="home-alumni-avatar" />
              </div>
              <span className="home-alumni-tag">{t('pages.index.homeAlumni.batchTag', 'BATCH')} 1995</span>
              <h3 className="home-alumni-title">{formatGraduateName('Al Hafil Cms. Mohamed Fowsan')}</h3>
              <p className="home-alumni-location">
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {formatOrigin('Sammanthurai')}
              </p>
            </div>
            <div className="home-alumni-card">
              <div className="home-alumni-avatar-wrap">
                <img src="/assets/images/alumni_profile.webp" alt="Al Hafil Ar. Mohamed Jareer" className="home-alumni-avatar" />
              </div>
              <span className="home-alumni-tag">{t('pages.index.homeAlumni.batchTag', 'BATCH')} 1995</span>
              <h3 className="home-alumni-title">{formatGraduateName('Al Hafil Ar. Mohamed Jareer')}</h3>
              <p className="home-alumni-location">
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {formatOrigin('Maruthamunai')}
              </p>
            </div>
            <div className="home-alumni-card">
              <div className="home-alumni-avatar-wrap">
                <img src="/assets/images/alumni_profile.webp" alt="Al Hafil Ac. Mohamed Mubarak" className="home-alumni-avatar" />
              </div>
              <span className="home-alumni-tag">{t('pages.index.homeAlumni.batchTag', 'BATCH')} 1995</span>
              <h3 className="home-alumni-title">{formatGraduateName('Al Hafil Ac. Mohamed Mubarak')}</h3>
              <p className="home-alumni-location">
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {formatOrigin('Ninthavur')}
              </p>
            </div>
            <div className="home-alumni-card">
              <div className="home-alumni-avatar-wrap">
                <img src="/assets/images/alumni_profile.webp" alt="Al Hafil Ab. Mohamed Rivai" className="home-alumni-avatar" />
              </div>
              <span className="home-alumni-tag">{t('pages.index.homeAlumni.batchTag', 'BATCH')} 1997</span>
              <h3 className="home-alumni-title">{formatGraduateName('Al Hafil Ab. Mohamed Rivai')}</h3>
              <p className="home-alumni-location">
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {formatOrigin('Ninthavur')}
              </p>
            </div>
          </div>

          <div className="home-preview-cta">
            <Link href="/alumni" className="btn btn-primary home-alumni-cta">
              {t('pages.index.homeAlumni.cta', 'Browse Complete Alumni Directory')} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Short Version: Gallery */}
      <section className="section-container home-section-pad" id="home-gallery">
        <div className="section-title-wrapper" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="subtitle home-gallery-sub">
            {t('pages.index.homeGallery.subtitle', 'Campus & Activities')}
          </span>
          <h2 className="section-title home-gallery-title">
            {t('pages.index.homeGallery.title', 'Moments at the Institute')}
          </h2>
          <p
            className="home-gallery-copy"
            style={{ maxWidth: '650px', margin: '1rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            {t('pages.index.homeGallery.copy', 'Glimpses into our sacred learning atmosphere, daily prayers, memorization sessions, and annual institutional milestones.')}
          </p>
        </div>

        <div className="photos-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="photo-card" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px' }}>
            <img
              src="https://images.unsplash.com/photo-1585036156171-384164a8c675?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Students studying the Quran"
              className="photo-card-img"
            />
            <div className="photo-card-overlay">
              <div className="photo-zoom-icon"><i className="fa-solid fa-eye"></i></div>
            </div>
            <div className="photo-card-desc">
              {t('pages.index.homeGallery.photos.0', 'Students studying Quran in main hall')}
            </div>
          </div>
          <div className="photo-card" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px' }}>
            <img
              src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Madrasa Mosque Interior"
              className="photo-card-img"
            />
            <div className="photo-card-overlay">
              <div className="photo-zoom-icon"><i className="fa-solid fa-eye"></i></div>
            </div>
            <div className="photo-card-desc">
              {t('pages.index.homeGallery.photos.1', 'Madrasa Mosque & Prayer Hall')}
            </div>
          </div>
          <div className="photo-card" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px' }}>
            <img
              src="https://images.unsplash.com/photo-1606820864387-e23a41e975ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Annual Gathering & Awards"
              className="photo-card-img"
            />
            <div className="photo-card-overlay">
              <div className="photo-zoom-icon"><i className="fa-solid fa-eye"></i></div>
            </div>
            <div className="photo-card-desc">
              {t('pages.index.homeGallery.photos.2', 'Annual Gathering & Awards')}
            </div>
          </div>
          <div className="photo-card" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px' }}>
            <img
              src="https://images.unsplash.com/photo-1628189871790-2527fc69537d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Evening Dua after Prayers"
              className="photo-card-img"
            />
            <div className="photo-card-overlay">
              <div className="photo-zoom-icon"><i className="fa-solid fa-eye"></i></div>
            </div>
            <div className="photo-card-desc">
              {t('pages.index.homeGallery.photos.3', 'Evening Dua & Reflection')}
            </div>
          </div>
        </div>

        <div className="home-preview-cta">
          <Link href="/events" className="btn btn-primary home-gallery-cta">
            {t('pages.index.homeGallery.cta', 'Explore All Events')} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
          </Link>
        </div>
      </section>
    </>
  );
}
