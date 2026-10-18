'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitAlumniRegistration } from '../../lib/supabaseClient';

export default function AlumniContent() {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    name_tamil: '',
    title: 'Al-Hafiz',
    dob: '',
    gender: 'male',
    nic: '',
    completion_year: '2024',
    program: 'Hifz-ul-Quran',
    student_id: '',
    hifz_status: 'completed',
    phone: '',
    email: '',
    city: '',
    country: 'Sri Lanka',
    address: '',
    occupation: '',
    organization: '',
    higher_education: '',
    interests: [] as string[],
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);

  const batchYears = [
    '2026', '2025', '2024', '2023', '2022', '2021', '2020',
    '2019', '2018', '2017', '2016', '2015', '2014', '2013',
    '2012', '2011', '2010', '2009', '2008', '2007', '2006',
    '2005', '2004', '2003', '2002', '2001', '2000', '1999',
    '1998', '1997', '1996', '1995', 'Pre-1995 / Other'
  ];

  const countries = [
    'Sri Lanka',
    'Qatar',
    'United Arab Emirates',
    'Saudi Arabia',
    'Kuwait',
    'Oman',
    'Bahrain',
    'United Kingdom',
    'Australia',
    'Canada',
    'United States',
    'Malaysia',
    'Singapore',
    'India',
    'Other'
  ];

  const interestOptions = [
    { id: 'mentorship', label: t('pages.alumni.form.interestMentorship', 'Mentoring current students & career counseling') },
    { id: 'events', label: t('pages.alumni.form.interestEvents', 'Organizing Alumni reunions & gatherings') },
    { id: 'dawa', label: t('pages.alumni.form.interestDawa', "Participating in community Da'wa projects") },
    { id: 'lectures', label: t('pages.alumni.form.interestLectures', 'Delivering guest lectures or academic sessions') },
    { id: 'support', label: t('pages.alumni.form.interestSupport', 'Financial support / Waqf contribution') },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(id);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== id) : [...prev.interests, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic Validation
    if (!formData.full_name.trim()) {
      setFeedback({ type: 'error', message: t('pages.alumni.form.errRequired', 'Please enter your full name.') });
      return;
    }
    if (!formData.phone.trim()) {
      setFeedback({ type: 'error', message: t('pages.alumni.form.errPhone', 'Please enter your phone/WhatsApp number.') });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFeedback({ type: 'error', message: t('pages.alumni.form.errEmail', 'Please enter a valid email address.') });
      return;
    }
    if (!formData.city.trim()) {
      setFeedback({ type: 'error', message: t('pages.alumni.form.errRequired', 'Please enter your current city or town.') });
      return;
    }
    if (!formData.occupation.trim()) {
      setFeedback({ type: 'error', message: t('pages.alumni.form.errRequired', 'Please enter your current occupation.') });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await submitAlumniRegistration({
        full_name: formData.full_name.trim(),
        name_tamil: formData.name_tamil.trim(),
        title: formData.title,
        dob: formData.dob,
        gender: formData.gender,
        nic: formData.nic.trim(),
        completion_year: formData.completion_year,
        program: formData.program,
        student_id: formData.student_id.trim(),
        is_hafiz: formData.hifz_status === 'completed',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        country: formData.country,
        address: formData.address.trim(),
        occupation: formData.occupation.trim(),
        organization: formData.organization.trim(),
        higher_education: formData.higher_education.trim(),
        interests: formData.interests,
        message: formData.message.trim(),
      });

      setConfirmedData({
        name: `${formData.title ? formData.title + ' ' : ''}${formData.full_name.trim()}`,
        year: formData.completion_year,
        program: formData.program,
        phone: formData.phone.trim(),
        location: `${formData.city.trim()}, ${formData.country}`,
      });

      setShowConfirmModal(true);

      // Reset form
      setFormData({
        full_name: '',
        name_tamil: '',
        title: 'Al-Hafiz',
        dob: '',
        gender: 'male',
        nic: '',
        completion_year: '2024',
        program: 'Hifz-ul-Quran',
        student_id: '',
        hifz_status: 'completed',
        phone: '',
        email: '',
        city: '',
        country: 'Sri Lanka',
        address: '',
        occupation: '',
        organization: '',
        higher_education: '',
        interests: [],
        message: '',
      });
    } catch (err: any) {
      console.error('Alumni submission error:', err);
      setFeedback({
        type: 'error',
        message: err.message || t('pages.contact.form.fail', 'Failed to submit registration. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">
            {t('pages.alumni.hero.subtitle', 'Alumni Association & Global Network')}
          </span>
          <h1>{t('pages.alumni.hero.title', 'Alumni Registration')}</h1>
          <p>
            {t(
              'pages.alumni.hero.copy',
              'Welcome to the official IDI Alumni Association portal. We invite all past students and alumni of the Institute to register their details, reconnect with fellow alumni, and participate in institutional initiatives.'
            )}
          </p>
        </div>
      </section>


      {/* Network Benefits / Pillars */}
      <section className="section-container" style={{ paddingBottom: '2rem' }}>
        <div className="section-title-wrapper" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="subtitle">{t('pages.alumni.pillars.subtitle', 'Our Network')}</span>
          <h2 className="section-title">{t('pages.alumni.pillars.title', 'Why Register as an Alumnus?')}</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              transition: 'var(--transition)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(0, 109, 68, 0.08)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1.5rem',
              }}
            >
              <i className="fa-solid fa-users-rays"></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>
              {t('pages.alumni.pillars.pillar1Title', 'Brotherhood & Network')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {t('pages.alumni.pillars.pillar1Desc', 'Reconnect with your classmates, teachers, and global alumni chapters spanning Sri Lanka and beyond.')}
            </p>
          </div>

          <div
            style={{
              background: 'white',
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              transition: 'var(--transition)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(184, 134, 11, 0.08)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1.5rem',
              }}
            >
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>
              {t('pages.alumni.pillars.pillar2Title', 'Events & Convocations')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {t('pages.alumni.pillars.pillar2Desc', 'Receive priority invitations to IDI annual convocations, special lectures, and alumni reunions.')}
            </p>
          </div>

          <div
            style={{
              background: 'white',
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              transition: 'var(--transition)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(0, 109, 68, 0.08)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1.5rem',
              }}
            >
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>
              {t('pages.alumni.pillars.pillar3Title', 'Mentorship & Impact')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {t('pages.alumni.pillars.pillar3Desc', 'Mentor the current generation of students, conduct guest workshops, and contribute to institutional welfare.')}
            </p>
          </div>
        </div>

        {/* The Alumni Registration Form Card */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div
            className="form-card"
            style={{
              padding: '3.5rem 3rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
              background: 'white',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--accent-emerald)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '0.5rem',
                }}
              >
                {t('pages.alumni.hero.subtitle', 'Global Alumni Network')}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {t('pages.alumni.form.title', 'Alumni Registration Form')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {t('pages.alumni.form.subtitle', 'Please complete all required fields (*) with your current information')}
              </p>
            </div>

            {/* Error / Success Feedback Banner */}
            {feedback && (
              <div
                className={`form-feedback ${feedback.type === 'success' ? 'success' : 'error'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '2rem',
                  backgroundColor: feedback.type === 'success' ? 'rgba(0, 109, 68, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                  color: feedback.type === 'success' ? 'var(--accent-emerald)' : '#dc2626',
                  border: `1px solid ${feedback.type === 'success' ? 'rgba(0, 109, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`,
                }}
              >
                <i
                  className={feedback.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}
                  style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}
                ></i>
                <span style={{ fontWeight: 500 }}>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* ────────────────────────────────────────────────────────── */}
              {/* SECTION 1: Personal Details */}
              {/* ────────────────────────────────────────────────────────── */}
              <div style={{ marginBottom: '3rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid var(--accent-emerald)',
                    marginBottom: '1.75rem',
                  }}
                >
                  <i className="fa-solid fa-user" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}></i>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    {t('pages.alumni.form.secPersonal', '1. Personal Information')}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Title / Honorific */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.titleHonorific', 'Title / Honorific')}
                    </label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      <option value="Al-Hafiz">{t('pages.alumni.form.optTitleHafiz', 'Al-Hafiz (அல்-ஹாபிழ்)')}</option>
                      <option value="Moulavi">{t('pages.alumni.form.optTitleMoulavi', 'Moulavi / Al-Alim (மௌலவி)')}</option>
                      <option value="Ash-Sheikh">{t('pages.alumni.form.optTitleSheikh', 'Ash-Sheikh (அஷ்-ஷைக்)')}</option>
                      <option value="Mr.">{t('pages.alumni.form.optTitleMr', 'Mr. / Brother')}</option>
                      <option value="Dr.">{t('pages.alumni.form.optTitleDr', 'Dr. / Eng. / Prof.')}</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.fullName', 'Full Name (English) *')}
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.fullNamePlaceholder', 'e.g. Al-Hafiz M. Ahmed Ali')}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Name in Tamil / Alternate */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.nameTamil', 'Name in Tamil / Other Language (Optional)')}
                    </label>
                    <input
                      type="text"
                      name="name_tamil"
                      value={formData.name_tamil}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.nameTamilPlaceholder', 'e.g. அல்-ஹாபிழ் எம். அஹ்மத் அலி')}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.dob', 'Date of Birth (Optional)')}
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.gender', 'Gender')}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      <option value="male">{t('pages.alumni.form.genderMale', 'Male')}</option>
                      <option value="female">{t('pages.alumni.form.genderFemale', 'Female')}</option>
                    </select>
                  </div>

                  {/* NIC / Passport */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.nic', 'NIC / Passport No. (Optional)')}
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.nicPlaceholder', 'e.g. 199512345678')}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SECTION 2: Institute Academic History */}
              {/* ────────────────────────────────────────────────────────── */}
              <div style={{ marginBottom: '3rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid var(--accent-emerald)',
                    marginBottom: '1.75rem',
                  }}
                >
                  <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}></i>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    {t('pages.alumni.form.secAcademic', '2. Institute Academic History')}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Completion / Batch Year */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.completionYear', 'Year of Completion / Last Batch Attended *')}
                    </label>
                    <select
                      name="completion_year"
                      value={formData.completion_year}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      {batchYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Program Attended */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.program', 'Program Attended at IDI *')}
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      <option value="Hifz-ul-Quran">{t('pages.alumni.form.progHifz', 'Hifz-ul-Quran (Full Memorization)')}</option>
                      <option value="Dawa & Islamic Studies">{t('pages.alumni.form.progDawa', "Da'wa & Islamic Studies")}</option>
                      <option value="Open Madrasa">{t('pages.alumni.form.progOpen', 'Open Madrasa / Weekend Courses')}</option>
                      <option value="Short Term Course">{t('pages.alumni.form.progShort', 'Short Term Islamic Course')}</option>
                      <option value="Other">{t('pages.alumni.form.progOther', 'Other Program')}</option>
                    </select>
                  </div>

                  {/* Hifz Status */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.hifzStatus', 'Hifz Completion Status *')}
                    </label>
                    <select
                      name="hifz_status"
                      value={formData.hifz_status}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      <option value="completed">{t('pages.alumni.form.hifzCompleted', 'Completed full Hifz-ul-Quran at IDI')}</option>
                      <option value="partial">{t('pages.alumni.form.hifzPartial', 'Completed Hifz elsewhere / partial study at IDI')}</option>
                      <option value="none">{t('pages.alumni.form.hifzNotApplicable', 'Non-Hifz academic program')}</option>
                    </select>
                  </div>

                  {/* Student ID / Roll No */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.studentId', 'Admission / Student ID (Optional)')}
                    </label>
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.studentIdPlaceholder', 'e.g. IDI-1998-042')}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SECTION 3: Contact & Location Information */}
              {/* ────────────────────────────────────────────────────────── */}
              <div style={{ marginBottom: '3rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid var(--accent-emerald)',
                    marginBottom: '1.75rem',
                  }}
                >
                  <i className="fa-solid fa-address-book" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}></i>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    {t('pages.alumni.form.secContact', '3. Contact & Location Information')}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Phone / WhatsApp */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.phone', 'Phone / WhatsApp Number *')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.phonePlaceholder', '+94 77 123 4567')}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.email', 'Email Address *')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.emailPlaceholder', 'youremail@example.com')}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* City */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.city', 'Current City / Town *')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.cityPlaceholder', 'e.g. Colombo / Sammanthurai / Doha')}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Country */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.country', 'Country of Residence *')}
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {t('pages.alumni.form.address', 'Full Residential Address (Optional)')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('pages.alumni.form.addressPlaceholder', 'Street, District, Postal Code')}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SECTION 4: Profession & Higher Studies */}
              {/* ────────────────────────────────────────────────────────── */}
              <div style={{ marginBottom: '3rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid var(--accent-emerald)',
                    marginBottom: '1.75rem',
                  }}
                >
                  <i className="fa-solid fa-briefcase" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}></i>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    {t('pages.alumni.form.secCareer', '4. Profession & Higher Studies')}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Occupation */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.occupation', 'Current Occupation / Profession *')}
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.occupationPlaceholder', 'e.g. Imam, Teacher, Software Engineer, Businessman, Student')}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Organization */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.organization', 'Organization / Workplace / Institute (Optional)')}
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.organizationPlaceholder', 'Company, School, Masjid or University')}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Higher Education */}
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {t('pages.alumni.form.higherEducation', 'Higher Qualifications Achieved (Optional)')}
                    </label>
                    <input
                      type="text"
                      name="higher_education"
                      value={formData.higher_education}
                      onChange={handleChange}
                      placeholder={t('pages.alumni.form.higherEducationPlaceholder', 'e.g. BA, BSc, Al-Alimiyya, Diploma, etc.')}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SECTION 5: Alumni Engagement & Preferences */}
              {/* ────────────────────────────────────────────────────────── */}
              <div style={{ marginBottom: '3rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid var(--accent-emerald)',
                    marginBottom: '1.75rem',
                  }}
                >
                  <i className="fa-solid fa-hands-holding-circle" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}></i>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    {t('pages.alumni.form.secEngagement', '5. Alumni Engagement & Preferences')}
                  </h3>
                </div>

                {/* Interests checkboxes */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    {t('pages.alumni.form.interestsLabel', 'How would you like to contribute to IDI? (Optional)')}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                    {interestOptions.map((opt) => {
                      const isChecked = formData.interests.includes(opt.id);
                      return (
                        <label
                          key={opt.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: `1.5px solid ${isChecked ? 'var(--accent-emerald)' : 'var(--border-light)'}`,
                            background: isChecked ? 'rgba(0, 109, 68, 0.05)' : 'var(--bg-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: 'var(--text-primary)',
                            transition: 'var(--transition)',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleInterestToggle(opt.id)}
                            style={{ accentColor: 'var(--accent-emerald)', width: '18px', height: '18px' }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message / Feedback */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {t('pages.alumni.form.message', 'Memories, Message or Suggestions for IDI (Optional)')}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t(
                      'pages.alumni.form.messagePlaceholder',
                      'Share fond memories of your time at the Institute, or ideas for the alumni association...'
                    )}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    padding: '1.1rem 3rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: '40px',
                    minWidth: '280px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 8px 24px rgba(0, 109, 68, 0.25)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.75 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>{t('pages.alumni.form.submittingBtn', 'Submitting Registration...')}</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>{t('pages.alumni.form.submitBtn', 'Submit Alumni Registration')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>


      {/* Confirmation Modal */}
      {showConfirmModal && confirmedData && (
        <div
          className="confirm-modal-overlay active"
          id="alumni-confirm-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirmModal(false);
          }}
        >
          <div className="confirm-modal-card" style={{ maxWidth: '520px' }}>
            <div className="confirm-icon-circle" style={{ background: 'var(--accent-emerald)', color: 'white' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginTop: '1rem', color: 'var(--text-primary)' }}>
              {t('pages.alumni.confirm.title', 'Alumni Registration Successful!')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              {t(
                'pages.alumni.confirm.copy',
                'Jazakallahu Khairan! Your registration has been submitted successfully to the IDI Alumni Association. You are now officially enrolled in the global alumni network.'
              )}
            </p>

            <div className="confirm-details-box" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <div className="detail-row">
                <span className="detail-label">{t('pages.alumni.confirm.nameLabel', 'Alumnus Name:')}</span>
                <span className="detail-val">{confirmedData.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.alumni.confirm.batchLabel', 'Batch / Year:')}</span>
                <span className="detail-val">{confirmedData.year}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.alumni.confirm.programLabel', 'Program:')}</span>
                <span className="detail-val">{confirmedData.program}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.alumni.confirm.phoneLabel', 'Contact:')}</span>
                <span className="detail-val">{confirmedData.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.alumni.confirm.locationLabel', 'Location:')}</span>
                <span className="detail-val">{confirmedData.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.alumni.confirm.statusLabel', 'Membership Status:')}</span>
                <span className="detail-val" style={{ color: '#16a34a', fontWeight: 600 }}>
                  <i className="fa-solid fa-circle-check"></i> {t('pages.alumni.confirm.statusVal', 'Active Member - IDI Alumni Network')}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-confirm-ok"
              onClick={() => setShowConfirmModal(false)}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '0.9rem',
                backgroundColor: 'var(--accent-emerald)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i> {t('pages.alumni.confirm.doneBtn', 'Done')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
