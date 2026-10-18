'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function HifzContent() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'hifz' | 'school'>('all');
  const isTamil = language === 'ta';

  // Category 1: Hifz pillars
  const hifzPillars = [
    {
      icon: 'fa-star-and-crescent',
      title: t('pages.hifz.cat1.pillars.0.title', isTamil ? 'நாழிரா & தஜ்வீத் தேர்ச்சி' : 'Nazira & Tajweed Mastery'),
      copy: t(
        'pages.hifz.cat1.pillars.0.copy',
        isTamil
          ? 'சரியான உச்சரிப்பு (மஃகாரிஜ்), தஜ்வீத் விதிகள் மற்றும் அழகிய குரலில் ஓதும் தேர்ச்சியை மனனம் செய்வதற்கு முன்னரே வழங்குகிறோம்.'
          : 'Developing precise articulation (Makharij), phonetic rules, and rhythmic recitation before deep memorization begins.'
      ),
    },
    {
      icon: 'fa-book-open-reader',
      title: t('pages.hifz.cat1.pillars.1.title', isTamil ? 'தினசரி சபக் & சப்கி' : 'Daily Sabak & Sabki'),
      copy: t(
        'pages.hifz.cat1.pillars.1.copy',
        isTamil
          ? 'ஒவ்வொரு நாளும் அதிகாலையில் புதிய வசனங்களை மனனம் செய்வதும், முந்தைய பாடங்களை சப்கியாக மீட்டுவதும் வழக்கம்.'
          : 'Each morning begins with the memorization of new verses (Sabak), followed by guided revision of recent chapters (Sabki).'
      ),
    },
    {
      icon: 'fa-rotate',
      title: t('pages.hifz.cat1.pillars.2.title', isTamil ? 'தொடர் தௌர் மீட்டல்' : 'Cumulative Dour Cycles'),
      copy: t(
        'pages.hifz.cat1.pillars.2.copy',
        isTamil
          ? 'முன்பு மனனம் செய்த ஜூஸ்உக்கள் மனதிலிருந்து மறையாமல் இருக்க நாளாந்தம் திட்டமிட்ட கூட்டு மீட்டல் பயிற்சிகள்.'
          : 'Systematic daily revision rounds guarantee that previously memorized Juz remain firm and vivid in memory.'
      ),
    },
    {
      icon: 'fa-certificate',
      title: t('pages.hifz.cat1.pillars.3.title', isTamil ? 'தக்மீல், தௌரா & சனது' : 'Takmeel, Dawrah & Sanad'),
      copy: t(
        'pages.hifz.cat1.pillars.3.copy',
        isTamil
          ? '30 ஜூஸ்உக்களை நிறைவு செய்த பின்னர் 3 தடவைகள் முழுமையான தௌரா செய்து, பரீட்சிக்கப்பட்டு உயர் சனது வழங்கப்படுகிறது.'
          : 'Following the 30-Juz completion, students undergo 3 full Dawrah cycles, rigorous board audits, and receive the certified Sanad.'
      ),
    },
  ];

  // Category 1: 4-Year Progression
  const hifzLevels = [
    {
      number: '01',
      year: t('pages.hifz.cat1.levels.0.year', isTamil ? '01ம் வருடம்' : 'Year 01'),
      level: t('pages.hifz.cat1.levels.0.level', isTamil ? '01ம் நிலை' : 'Level 01'),
      juz: t('pages.hifz.cat1.levels.0.juz', isTamil ? '05 ஜூஸ்உக்கள் மனனம்' : '05 Juz Memorization'),
      copy: t(
        'pages.hifz.cat1.levels.0.copy',
        isTamil
          ? 'அடிப்படை தஜ்வீத், மஃகாரிஜ் பயிற்சி, சரளமாக ஓதுதல் மற்றும் முதல் 5 ஜூஸ்உக்கள் மனனம்.'
          : 'Foundational Tajweed, Makharij mastery, fluent recitation, and memorization of the first 5 Juz.'
      ),
    },
    {
      number: '02',
      year: t('pages.hifz.cat1.levels.1.year', isTamil ? '02ம் வருடம்' : 'Year 02'),
      level: t('pages.hifz.cat1.levels.1.level', isTamil ? '02 & 03ம் நிலைகள்' : 'Levels 02 & 03'),
      juz: t('pages.hifz.cat1.levels.1.juz', isTamil ? '10 ஜூஸ்உக்கள் மனனம்' : '10 Juz Memorization'),
      copy: t(
        'pages.hifz.cat1.levels.1.copy',
        isTamil
          ? 'முந்தைய பகுதிகளை உறுதிப்படுத்தி, மேலதிகமாக 10 ஜூஸ்உக்களை தினசரி திருப்புதலுடன் மனனம் செய்தல்.'
          : 'Consolidation of previous portions and memorization of an additional 10 Juz with daily revision.'
      ),
    },
    {
      number: '03',
      year: t('pages.hifz.cat1.levels.2.year', isTamil ? '03ம் வருடம்' : 'Year 03'),
      level: t('pages.hifz.cat1.levels.2.level', isTamil ? '04, 05 & 06ம் நிலைகள்' : 'Levels 04, 05 & 06'),
      juz: t('pages.hifz.cat1.levels.2.juz', isTamil ? '15 ஜூஸ்உக்கள் (முழு நிறைவு)' : '15 Juz (Completion of 30 Juz)'),
      copy: t(
        'pages.hifz.cat1.levels.2.copy',
        isTamil
          ? 'வேகமான மனனப் பயிற்சியுடன் புனித குர்ஆனின் முழு 30 ஜூஸ்உக்களையும் துல்லியமாக நிறைவு செய்தல்.'
          : 'Advanced memorization pacing completing the entire 30 Juz of the Holy Quran with high precision.'
      ),
    },
    {
      number: '04',
      year: t('pages.hifz.cat1.levels.3.year', isTamil ? '04ம் வருடம்' : 'Year 04'),
      level: t('pages.hifz.cat1.levels.3.level', isTamil ? 'தௌரா & தக்மீல்' : 'Dawrah & Takmeel'),
      juz: t('pages.hifz.cat1.levels.3.juz', isTamil ? '3 தடவைகள் முழு மீட்டல்' : '3 Complete Revisions'),
      copy: t(
        'pages.hifz.cat1.levels.3.copy',
        isTamil
          ? 'முழு குர்ஆனையும் 3 முறை தீவிரமாக மீளாய்வு செய்து, சனது பெறுவதற்கான இறுதித் தேர்வுக்குத் தயாராதல்.'
          : 'Intensive Dawrah revision completed three times, final oral examination, and preparation for Sanad award.'
      ),
    },
  ];

  // Category 2: Academic Components
  const academicComponents = [
    {
      icon: 'fa-graduation-cap',
      title: t('pages.hifz.cat2.components.0.title', isTamil ? 'க.பொ.த சாதாரண தரப் பாடங்கள்' : 'G.C.E. O/L Academic Subjects'),
      copy: t(
        'pages.hifz.cat2.components.0.copy',
        isTamil
          ? 'கணிதம், விஞ்ஞானம், ஆங்கிலம், தமிழ், வரலாறு மற்றும் ICT ஆகிய பொதுக் கல்விப் பாடங்களில் சிறந்த வழிகாட்டல்.'
          : 'Comprehensive coaching in core national curriculum subjects including Mathematics, Science, English, Tamil, History, and ICT.'
      ),
    },
    {
      icon: 'fa-kaaba',
      title: t('pages.hifz.cat2.components.1.title', isTamil ? 'இஸ்லாமியக் கலைகள் (ஷரீஆ அடிப்படைகள்)' : 'Islamic Sciences (Shariah Basics)'),
      copy: t(
        'pages.hifz.cat2.components.1.copy',
        isTamil
          ? 'நாளாந்த வாழ்வியல் சட்டங்கள் (ஃபிக்ஹ்), நபிகளாரின் வழிகாட்டல்கள் (ஹதீஸ்), நபிகளாரின் வரலாறு (ஸீரா) மற்றும் அகீதா.'
          : 'In-depth study of Fiqh (daily rulings), Hadith (Prophetic sayings), Seerah (biography of the Prophet ﷺ), and basic Aqeedah.'
      ),
    },
    {
      icon: 'fa-language',
      title: t('pages.hifz.cat2.components.2.title', isTamil ? 'அரபு மொழி & இலக்கணம்' : 'Arabic Language & Grammar'),
      copy: t(
        'pages.hifz.cat2.components.2.copy',
        isTamil
          ? 'அரபு இலக்கணம் (நஹ்வு, ஸர்ப்), வாசிப்புப் பழக்கம், மற்றும் குர்ஆனிய மொழியைப் புரிந்து கொள்ளும் ஆற்றல்.'
          : 'Instruction in Arabic grammar (Nahw & Sarf), vocabulary, reading comprehension, and conversational spoken skills.'
      ),
    },
    {
      icon: 'fa-laptop-code',
      title: t('pages.hifz.cat2.components.3.title', isTamil ? 'ICT & டிஜிட்டல் அறிவு' : 'ICT & Digital Literacy'),
      copy: t(
        'pages.hifz.cat2.components.3.copy',
        isTamil
          ? 'எமது கணினி மையத்தில் நடைமுறை கணினிப் பயிற்சி, நவீன கல்வி மென்பொருட்கள் மற்றும் தகவல் தொழில்நுட்ப அறிவு.'
          : 'Hands-on practical training in computer basics, productivity software, and modern research tools in our tech center.'
      ),
    },
  ];

  // Category 2: Subjects
  const academicSubjects = [
    {
      name: t('pages.hifz.cat2.subjects.0.name', isTamil ? 'கணிதம்' : 'Mathematics'),
      desc: t('pages.hifz.cat2.subjects.0.desc', isTamil ? 'பகுப்பாய்வு சிந்தனை மற்றும் கணக்கீட்டுத் திறன்' : 'Analytical thinking & problem solving'),
      icon: 'fa-calculator',
    },
    {
      name: t('pages.hifz.cat2.subjects.1.name', isTamil ? 'விஞ்ஞானம்' : 'Science'),
      desc: t('pages.hifz.cat2.subjects.1.desc', isTamil ? 'பௌதிகவியல், இரசாயனவியல் & உயிரியல் அடிப்படைகள்' : 'Physics, Chemistry & Biology fundamentals'),
      icon: 'fa-flask-vial',
    },
    {
      name: t('pages.hifz.cat2.subjects.2.name', isTamil ? 'ஆங்கில மொழி' : 'English Language'),
      desc: t('pages.hifz.cat2.subjects.2.desc', isTamil ? 'இலக்கணம், எழுத்தாற்றல் மற்றும் பேசும் திறன்' : 'Grammar, writing & conversational fluency'),
      icon: 'fa-book-atlas',
    },
    {
      name: t('pages.hifz.cat2.subjects.3.name', isTamil ? 'தமிழ் மொழி & இலக்கியம்' : 'Tamil Language & Literature'),
      desc: t('pages.hifz.cat2.subjects.3.desc', isTamil ? 'தாய்மொழி அறிவு, இலக்கணம் மற்றும் கட்டுரை வரைதல்' : 'Native linguistic mastery & essay composition'),
      icon: 'fa-feather-pointed',
    },
    {
      name: t('pages.hifz.cat2.subjects.4.name', isTamil ? 'வரலாறு & குடியியற்கல்வி' : 'History & Civics'),
      desc: t('pages.hifz.cat2.subjects.4.desc', isTamil ? 'வரலாற்றுப் பின்னணி மற்றும் சமூக விழிப்புணர்வு' : 'National history, heritage & civic awareness'),
      icon: 'fa-landmark-dome',
    },
    {
      name: t('pages.hifz.cat2.subjects.5.name', isTamil ? 'தகவல் தொடர்பாடல் தொழில்நுட்பம் (ICT)' : 'Information Technology (ICT)'),
      desc: t('pages.hifz.cat2.subjects.5.desc', isTamil ? 'கணினி அடிப்படைகள் மற்றும் டிஜிட்டல் கருவிகள்' : 'Computer fundamentals & modern digital tools'),
      icon: 'fa-desktop',
    },
    {
      name: t('pages.hifz.cat2.subjects.6.name', isTamil ? 'இஸ்லாமியக் கல்வி & ஃபிக்ஹ்' : 'Islamic Studies & Fiqh'),
      desc: t('pages.hifz.cat2.subjects.6.desc', isTamil ? 'முறையான மார்க்க அறிவு மற்றும் ஒழுக்க நெறிகள்' : 'Comprehensive Deen knowledge & rulings'),
      icon: 'fa-mosque',
    },
    {
      name: t('pages.hifz.cat2.subjects.7.name', isTamil ? 'அரபு மொழி' : 'Arabic Language'),
      desc: t('pages.hifz.cat2.subjects.7.desc', isTamil ? 'குர்ஆனிய அரபு மற்றும் இலக்கணக் கட்டமைப்பு' : 'Qur’anic Arabic & grammatical syntax'),
      icon: 'fa-language',
    },
  ];


  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">
            {t('pages.hifz.hero.subtitle', isTamil ? 'ஆன்மிக மற்றும் கல்விசார் சிறப்பு' : 'Academic & Spiritual Excellence')}
          </span>
          <h1>
            {t('pages.hifz.hero.title', isTamil ? 'எங்கள் பாடத்திட்டங்கள்' : 'Our Programs')}
          </h1>
          <p>
            {t(
              'pages.hifz.hero.copy',
              isTamil
                ? 'இரு வழிமுறைகளைக் கொண்ட ஒருங்கிணைந்த கல்வித் திட்டம்: முழுமையான புனித குர்ஆன் மனனம் மற்றும் அரசினால் அங்கீகரிக்கப்பட்ட இடைநிலைப் பாடசாலைக் கல்வி.'
                : 'A distinguished dual-track curriculum: comprehensive Quranic memorization alongside government-recognized secondary school education.'
            )}
          </p>
        </div>
      </section>

      {/* Program Category Filter Tabs */}
      <section className="programs-filter-section">
        <div className="section-container" style={{ paddingBottom: '0.5rem', paddingTop: '2.5rem' }}>
          <div className="program-tabs-wrapper">
            <button
              type="button"
              className={`program-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>{t('pages.hifz.filter.all', isTamil ? 'அனைத்து திட்டங்களும்' : 'All Programs')}</span>
            </button>
            <button
              type="button"
              className={`program-tab-btn ${activeTab === 'hifz' ? 'active' : ''}`}
              onClick={() => setActiveTab('hifz')}
            >
              <i className="fa-solid fa-star-and-crescent"></i>
              <span>{t('pages.hifz.filter.hifz', isTamil ? '1. தஹ்ஃபீஸுல் குர்ஆன் (ஹிஃப்ழ்)' : '1. Tahfeez-ul-Quran (Hifz)')}</span>
            </button>
            <button
              type="button"
              className={`program-tab-btn ${activeTab === 'school' ? 'active' : ''}`}
              onClick={() => setActiveTab('school')}
            >
              <i className="fa-solid fa-graduation-cap"></i>
              <span>{t('pages.hifz.filter.school', isTamil ? '2. பாடசாலைக் கல்வி & O/L' : '2. School Studies & O/L')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dual-Track Overview Banner */}
      <section className="section-container" style={{ paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>
        <div className="program-overview-card">
          <div className="program-overview-content">
            <span className="badge-pill">
              <i className="fa-solid fa-scale-balanced" style={{ marginRight: '6px' }}></i>
              {t('pages.hifz.overview.badge', isTamil ? 'இருமுகக் கல்வித் திட்டம்' : 'Dual-Track Curriculum')}
            </span>
            <h2 className="overview-title">
              {t('pages.hifz.overview.title', isTamil ? 'வெற்றிக்கான இரு சமநிலைப் பாதைகள்' : 'Two Balanced Pathways to Success')}
            </h2>
            <p className="overview-copy">
              {t(
                'pages.hifz.overview.copy',
                isTamil
                  ? 'இறைவனின் வேத அறிவையும் பயனுள்ள உலகக் கல்வியையும் இணைத்து கற்பிப்பதில் தஃவா இஸ்லாமிய்யா நிறுவனம் உறுதியாக நிற்கிறது. மாணவர்கள் ஹிஃப்ழ் அல்லது பாடசாலைக் கல்வி ஆகியவற்றில் ஒன்றை மட்டும் தெரிவு செய்ய வேண்டியதில்லை — இரண்டையும் மிகச் சிறந்த முறையில் ஒரே கூரையின் கீழ் நிறைவு செய்கிறார்கள்.'
                  : "At the Institute of Da'wa Islamiyya, we firmly believe in the harmony of divine revelation and beneficial worldly knowledge. Our students don't have to choose between becoming a Hafiz and obtaining a recognized secondary school education — they achieve both with excellence under one roof."
              )}
            </p>
            <div className="overview-badges">
              <span className="track-chip">
                <i className="fa-solid fa-check-circle" style={{ color: 'var(--accent-gold)' }}></i>
                {t('pages.hifz.overview.tag1', isTamil ? 'தஹ்ஃபீஸுல் குர்ஆன் (4 வருடப் பாடநெறி)' : 'Tahfeez-ul-Quran (4-Year Hifz Course)')}
              </span>
              <span className="track-chip">
                <i className="fa-solid fa-check-circle" style={{ color: 'var(--accent-gold)' }}></i>
                {t('pages.hifz.overview.tag2', isTamil ? 'தேசிய பாடத்திட்டம் (தரம் 6 முதல் 11 O/L வரை)' : 'National Curriculum (Grades 6–11 O/L)')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CATEGORY 1: Tahfeez-ul-Quran (Hifz Program)                     */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'hifz') && (
        <section id="category-hifz" className="program-category-wrapper">
          <div className="section-container">
            <div className="category-header">
              <div className="category-meta-badge badge-emerald">
                <i className="fa-solid fa-star-and-crescent"></i>
                {t('pages.hifz.cat1.badge', isTamil ? 'பிரிவு 01 • ஆன்மிக அடிப்படை' : 'Category 01 • Spiritual Core')}
              </div>
              <h2 className="category-main-title">
                {t('pages.hifz.cat1.title', isTamil ? 'தஹ்ஃபீஸுல் குர்ஆன் (ஹிஃப்ழ் பாடத்திட்டம்)' : 'Tahfeez-ul-Quran (Hifz Program)')}
              </h2>
              <p className="category-subtitle">
                {t('pages.hifz.cat1.subtitle', isTamil ? '4 வருட முறையான மனனப் பாடத்திட்டம்' : 'Systematic 4-Year Memorization Curriculum')}
              </p>
              <p className="category-description">
                {t(
                  'pages.hifz.cat1.copy',
                  isTamil
                    ? 'எமது முதன்மைத் திட்டமான ஹிஃப்ழ் பாடநெறி 4 கல்வி ஆண்டுகளில் 6 நிலைகளைக் கொண்டு கட்டமைக்கப்பட்டுள்ளது. சரியான தஜ்வீத், முறையான மீட்டல் மற்றும் சனது சான்றிதழுடன் புனித குர்ஆனை நெஞ்சில் தாங்க வழிகாட்டுகிறது.'
                    : 'Our flagship Hifz program is structured across 6 levels spanning four academic years. Grounded in pure Tajweed and classical memorization methodology, it guarantees steadfast retention, spiritual refinement, and authentic Sanad certification.'
                )}
              </p>
            </div>

            {/* Highlights Bar */}
            <div className="highlights-banner">
              <div className="highlight-item">
                <i className="fa-solid fa-user-check highlight-icon"></i>
                <span>{isTamil ? 'சனது பெற்ற தஜ்வீத் பேராசிரியர்கள்' : 'Certified Tajweed Scholars'}</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-stairs highlight-icon"></i>
                <span>{isTamil ? '4 வருடங்களில் 6 நிலைகள்' : '6 Levels over 4 Years'}</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-repeat highlight-icon"></i>
                <span>{isTamil ? '3 சுழற்சி மீட்டல் (தௌர்)' : '3 Dawrah Revision Cycles'}</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-award highlight-icon"></i>
                <span>{isTamil ? 'உத்தியோகபூர்வ ஹாஃபிழ் சனது' : 'Official Sanad at Convocation'}</span>
              </div>
            </div>

            {/* Hifz Methodology Pillars */}
            <div className="subsection-title-wrap">
              <span className="subtitle">{isTamil ? 'கற்பித்தல் முறை' : 'Methodology'}</span>
              <h3 className="subsection-title">
                {t('pages.hifz.cat1.curriculumTitle', isTamil ? 'ஹிஃப்ழ் கற்பித்தல் தூண்கள்' : 'Hifz Methodology & Pillars')}
              </h3>
            </div>

            <div className="grid-container" style={{ marginBottom: '3.5rem' }}>
              {hifzPillars.map((pillar, idx) => (
                <div key={idx} className="card program-card">
                  <div className="card-icon">
                    <i className={`fa-solid ${pillar.icon}`}></i>
                  </div>
                  <h4 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                    {pillar.title}
                  </h4>
                  <p className="card-text">{pillar.copy}</p>
                </div>
              ))}
            </div>

            {/* 4-Year Progression Breakdown */}
            <div className="level-progression-box">
              <div className="level-progression-header">
                <span className="badge-pill badge-gold">
                  <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '6px' }}></i>
                  {isTamil ? 'கட்டமைப்பு' : 'Roadmap'}
                </span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-emerald)', marginTop: '0.5rem' }}>
                  {t('pages.hifz.cat1.levelsTitle', isTamil ? '4 வருட நிலை முன்னேற்றம்' : '4-Year Level Progression')}
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0.5rem auto 0' }}>
                  {t(
                    'pages.hifz.cat1.levelsIntro',
                    isTamil
                      ? 'மனனப் பாடத்திட்டம் 4 வருடங்களில் 6 நிலைகளாக ஒழுங்குபடுத்தப்பட்டுள்ளது:'
                      : 'The memorization curriculum is arranged across 6 levels, progressing steadily over four academic years:'
                  )}
                </p>
              </div>

              <div className="levels-grid">
                {hifzLevels.map((lvl, index) => (
                  <div key={index} className="level-card">
                    <div className="level-card-number">{lvl.number}</div>
                    <div className="level-card-year">{lvl.year}</div>
                    <div className="level-card-badge">{lvl.level}</div>
                    <div className="level-card-juz">{lvl.juz}</div>
                    <p className="level-card-text">{lvl.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* CATEGORY 2: School Studies & Academic Education                 */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'school') && (
        <section
          id="category-school"
          className="program-category-wrapper"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-light)',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div className="section-container">
            <div className="category-header">
              <div className="category-meta-badge badge-gold">
                <i className="fa-solid fa-graduation-cap"></i>
                {t('pages.hifz.cat2.badge', isTamil ? 'பிரிவு 02 • கல்விசார் சிறப்பு' : 'Category 02 • Academic Excellence')}
              </div>
              <h2 className="category-main-title">
                {t('pages.hifz.cat2.title', isTamil ? 'பாடசாலைக் கல்வி & பொதுப் பாடங்கள்' : 'School Studies & Academic Education')}
              </h2>
              <p className="category-subtitle">
                {t('pages.hifz.cat2.subtitle', isTamil ? 'தேசிய பாடத்திட்டம் (தரம் 6 முதல் 11 O/L) & இஸ்லாமியக் கலைகள்' : 'National Curriculum (Grades 6–11 O/L) & Islamic Sciences')}
              </p>
              <p className="category-description">
                {t(
                  'pages.hifz.cat2.copy',
                  isTamil
                    ? 'ஹிஃப்ழ் கல்வியுடன் இணைந்து, தரம் 6 முதல் 11 (க.பொ.த சாதாரண தரம் - O/L) வரையிலான அரச அங்கீகாரம் பெற்ற பாடசாலைக் கல்வியும், அடிப்படை இஸ்லாமிய அறிவியலும் மாணவர்களுக்கு கற்பிக்கப்படுகிறது.'
                    : 'Integrated seamlessly with our Hifz program, students receive formal secondary schooling following the national syllabus, preparing them thoroughly for the G.C.E. Ordinary Level (O/L) examinations and future higher education.'
                )}
              </p>
            </div>

            {/* Highlights Bar */}
            <div className="highlights-banner">
              <div className="highlight-item">
                <i className="fa-solid fa-book-bookmark highlight-icon"></i>
                <span>{isTamil ? 'தரம் 6 முதல் 11 (O/L வரை)' : 'Grades 6 to 11 (O/L)'}</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-chalkboard-user highlight-icon"></i>
                <span>{isTamil ? 'அனுபவமிக்க பாட ஆசிரியர்கள்' : 'Expert Subject Teachers'}</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-mosque highlight-icon"></i>
                <span>{isTamil ? 'ஃபிக்ஹ் & ஹதீஸ் கலைகள்' : 'Fiqh, Hadith & Seerah'}</span>
              </div>
              <div className="highlight-item">
                <i className="fa-solid fa-computer highlight-icon"></i>
                <span>{isTamil ? 'ICT கணினி ஆய்வகம்' : 'ICT & Digital Literacy'}</span>
              </div>
            </div>

            {/* Academic Structure Pillars */}
            <div className="subsection-title-wrap">
              <span className="subtitle">{isTamil ? 'கல்வித் தூண்கள்' : 'Core Components'}</span>
              <h3 className="subsection-title">
                {t('pages.hifz.cat2.componentsTitle', isTamil ? 'கல்விசார் பாடத்திட்டக் கட்டமைப்பு' : 'Academic Curriculum Structure')}
              </h3>
            </div>

            <div className="grid-container" style={{ marginBottom: '3.5rem' }}>
              {academicComponents.map((comp, idx) => (
                <div key={idx} className="card program-card">
                  <div className="card-icon" style={{ color: 'var(--accent-gold)' }}>
                    <i className={`fa-solid ${comp.icon}`}></i>
                  </div>
                  <h4 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                    {comp.title}
                  </h4>
                  <p className="card-text">{comp.copy}</p>
                </div>
              ))}
            </div>

            {/* Subjects Grid */}
            <div className="subjects-section-wrap">
              <div className="level-progression-header">
                <span className="badge-pill badge-emerald">
                  <i className="fa-solid fa-book" style={{ marginRight: '6px' }}></i>
                  {isTamil ? 'பாடங்கள்' : 'Curriculum'}
                </span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-emerald)', marginTop: '0.5rem' }}>
                  {t('pages.hifz.cat2.subjectsTitle', isTamil ? 'கற்பிக்கப்படும் முக்கிய பாடங்கள்' : 'Core Academic Subjects Taught')}
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0.5rem auto 0' }}>
                  {isTamil
                    ? 'இலங்கை கல்வி அமைச்சின் அங்கீகாரம் பெற்ற பாடத்திட்டம் மற்றும் இஸ்லாமிய அடிப்படைகள்:'
                    : 'Following the Ministry of Education Sri Lanka national syllabus alongside foundational Islamic subjects:'}
                </p>
              </div>

              <div className="subjects-grid">
                {academicSubjects.map((sub, idx) => (
                  <div key={idx} className="subject-card">
                    <div className="subject-icon-box">
                      <i className={`fa-solid ${sub.icon}`}></i>
                    </div>
                    <div className="subject-info">
                      <h4 className="subject-name">{sub.name}</h4>
                      <p className="subject-desc">{sub.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}



      {/* ============================================================== */}
      {/* ADMISSIONS & REQUIREMENTS CTA BANNER                           */}
      {/* ============================================================== */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          padding: '4.5rem 0',
        }}
      >
        <div className="section-container">
          <div className="admissions-card">
            <div className="admissions-card-content">
              <span className="badge-pill badge-gold">
                <i className="fa-solid fa-door-open" style={{ marginRight: '6px' }}></i>
                {t('pages.hifz.admissions.badge', isTamil ? 'இணைந்து கொள்ளுங்கள்' : 'Join Our Institute')}
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-emerald)', marginTop: '0.75rem', marginBottom: '1rem' }}>
                {t('pages.hifz.admissions.title', isTamil ? 'சேர்க்கை & தகுதி நிபந்தனைகள்' : 'Admissions & Requirements')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {t(
                  'pages.hifz.admissions.copy',
                  isTamil
                    ? 'புனித குர்ஆனை மனனம் செய்யவும், பாடசாலைக் கல்வியைத் தொடரவும் விரும்பும் அர்ப்பணிப்புள்ள மாணவர்களை நாம் வரவேற்கிறோம்.'
                    : 'We welcome dedicated young students who aspire to memorize the Book of Allah while excelling in their academic journey.'
                )}
              </p>

              <div className="requirements-checklist">
                <div className="req-item">
                  <i className="fa-solid fa-circle-check req-check"></i>
                  <span>{isTamil ? 'சேர்க்கையின் போது வயது 10 முதல் 14 வரை இருத்தல்' : 'Age between 10 to 14 years at the time of entry'}</span>
                </div>
                <div className="req-item">
                  <i className="fa-solid fa-circle-check req-check"></i>
                  <span>{isTamil ? 'புனித குர்ஆனை நாழிராவாக (பார்த்து) சரளமாக ஓதக்கூடிய திறன்' : 'Basic ability to recite the Holy Quran with Nazira & Tajweed'}</span>
                </div>
                <div className="req-item">
                  <i className="fa-solid fa-circle-check req-check"></i>
                  <span>{isTamil ? 'ஆரம்பக் கல்வியை (தரம் 5) பூர்த்தி செய்திருத்தல்' : 'Completion of Primary schooling (Grade 5 standard)'}</span>
                </div>
                <div className="req-item">
                  <i className="fa-solid fa-circle-check req-check"></i>
                  <span>{isTamil ? 'விடுதி ஒழுக்க விதிகளுக்கு கட்டுப்படும் மனப்பான்மை' : 'Commitment to boarding discipline and institution ethics'}</span>
                </div>
                <div className="req-item">
                  <i className="fa-solid fa-circle-check req-check"></i>
                  <span>{isTamil ? 'நுழைவுப் பரிசீலனை மற்றும் நேர்முகத் தேர்வில் தேர்ச்சி பெறுதல்' : 'Successful completion of entry evaluation and interview'}</span>
                </div>
              </div>

              <div className="admissions-actions">
                <Link href="/contact" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
                  <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>
                  {t('pages.hifz.admissions.ctaContact', isTamil ? 'சேர்க்கைக்கு விண்ணப்பிக்க' : 'Apply for Admission')}
                </Link>
                <Link href="/students" className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
                  <i className="fa-solid fa-book-open" style={{ marginRight: '8px' }}></i>
                  {t('pages.hifz.admissions.ctaAbout', isTamil ? 'எங்கள் வரலாற்றுப் பயணம்' : 'Explore Our Journey')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
