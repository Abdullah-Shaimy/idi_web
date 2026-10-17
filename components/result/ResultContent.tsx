'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ResultContent() {
  const { t, language, translateSubject, translateExam, translateClassName } = useLanguage();
  const isTamil = language === 'ta';

  const [exam, setExam] = useState('');
  const [year, setYear] = useState('');
  const [regNo, setRegNo] = useState('');

  const [examOpen, setExamOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const examOptions = [
    { value: 'Term 1', label: translateExam('Term 1') },
    { value: 'Mid Year', label: translateExam('Mid Year') },
    { value: 'Final', label: translateExam('Final') },
    { value: 'Annual', label: translateExam('Annual') },
  ];

  const yearOptions = ['2024', '2025', '2026'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setActiveResult(null);

    const trimmedReg = regNo.trim().toUpperCase();

    if (!exam || !year) {
      setErrorMessage(t('pages.result.search.selectBoth', 'Please select both Examination and Academic Year.'));
      return;
    }

    if (!trimmedReg) {
      setErrorMessage(t('pages.result.search.enterReg', 'Please enter your Registration / Index Number.'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/data/results.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Unable to access result data.');
      const data = await res.json();

      const found = data.find(
        (item) =>
          item.regNo.toUpperCase() === trimmedReg &&
          item.exam.toLowerCase() === exam.toLowerCase() &&
          String(item.year) === String(year)
      );

      if (!found) {
        setErrorMessage(
          t(
            'pages.result.search.notFound',
            'No result was found for the provided details. Please check your Index Number, Exam, and Year.'
          )
        );
      } else {
        setActiveResult(found);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setErrorMessage(t('pages.result.search.fetchError', 'Failed to load examination records. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString(
    language === 'ta' ? 'ta-LK' : 'en-GB',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head no-print">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.result.hero.subtitle', 'Examinations')}</span>
          <h1>{t('pages.result.hero.title', 'Student Results Portal')}</h1>
          <p>
            {t(
              'pages.result.hero.copy',
              'Check official academic and memorization evaluation records.'
            )}
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section-container" style={{ minHeight: '60vh' }}>
        {/* Search Card */}
        <div className="result-search-card no-print">
          <div className="section-title-wrapper" style={{ marginBottom: '2rem' }}>
            <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
              {t('pages.result.search.subtitle', 'Verification')}
            </span>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>
              {t('pages.result.search.title', 'Find Your Marksheet')}
            </h2>
          </div>

          {errorMessage && (
            <div
              id="error-message"
              style={{
                color: 'var(--danger)',
                background: 'var(--danger-faint, #fee2e2)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2rem',
                border: '1px solid #fecaca',
                fontSize: '0.9rem',
              }}
            >
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
              {errorMessage}
            </div>
          )}

          <form id="result-form" onSubmit={handleSubmit}>
            {/* Exam Select */}
            <div className={`form-group custom-select-group ${exam ? 'active' : ''}`}>
              <div className="custom-select">
                <div
                  className={`select-selected ${examOpen ? 'select-arrow-active' : ''}`}
                  onClick={() => {
                    setExamOpen(!examOpen);
                    setYearOpen(false);
                  }}
                >
                  {exam ? translateExam(exam) : t('pages.result.search.examPlaceholder', 'Select Exam')}
                </div>
                {examOpen && (
                  <div className="select-items" style={{ display: 'block' }}>
                    {examOptions.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setExam(opt.value);
                          setExamOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className="form-label">
                {t('pages.result.search.examLabel', 'Examination')}
              </label>
            </div>

            {/* Year Select */}
            <div className={`form-group custom-select-group ${year ? 'active' : ''}`}>
              <div className="custom-select">
                <div
                  className={`select-selected ${yearOpen ? 'select-arrow-active' : ''}`}
                  onClick={() => {
                    setYearOpen(!yearOpen);
                    setExamOpen(false);
                  }}
                >
                  {year || t('pages.result.search.yearPlaceholder', 'Select Year')}
                </div>
                {yearOpen && (
                  <div className="select-items" style={{ display: 'block' }}>
                    {yearOptions.map((y) => (
                      <div
                        key={y}
                        onClick={() => {
                          setYear(y);
                          setYearOpen(false);
                        }}
                      >
                        {y}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className="form-label">
                {t('pages.result.search.yearLabel', 'Academic Year')}
              </label>
            </div>

            {/* Reg No input */}
            <div className="form-group">
              <input
                type="text"
                id="regNo"
                className="form-input"
                placeholder=" "
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
              />
              <label htmlFor="regNo" className="form-label">
                {t('pages.result.search.indexLabel', 'Index Number / Reg No')}
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <i className="fa-solid fa-spinner fa-spin"></i>{' '}
                  {t('pages.result.search.loading', isTamil ? 'சரிபார்க்கப்படுகிறது...' : 'Checking...')}
                </span>
              ) : (
                <span>
                  <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '8px' }}></i>
                  {t('pages.result.search.submitBtn', 'Check Result')}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {activeResult && (
          <div className="result-display-card" style={{ display: 'block' }}>
            {/* Official Header for print */}
            <div className="official-header print-only">
              <div className="header-top-row">
                <div className="header-side tamil-text">
                  தாறுத் தஃவா அல்குர்ஆன்<br />
                  மனனக் கல்லூரி<br />
                  <span style={{ fontSize: '0.85rem' }}>சம்மாந்துறை</span>
                </div>
                <div className="header-center">
                  <img src="/assets/images/idi_logo.webp" alt="IDI Logo" className="logo-main" />
                  <h1 className="institute-name-en">INSTITUTE OF DA'WA ISLAMIYYA</h1>
                  <span className="reg-no">Regd. No: MRCA/13/01/HQ/04</span>
                </div>
                <div className="header-side arabic-text">
                  معهد الدعوة الإسلامية<br />
                  لتحفيظ القرآن الكريم<br />
                  <span style={{ fontSize: '0.95rem' }}>صمانثري</span>
                </div>
              </div>
            </div>

            {/* Screen Header */}
            <div className="result-header">
              <span
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  opacity: 0.9,
                }}
              >
                {t('pages.result.result.headerTag', 'Official Marksheet')}
              </span>
              <h2>{t('pages.result.result.headerTitle', 'EXAMINATION REPORT')}</h2>
              <div className="student-details-grid">
                <div className="detail-item">
                  <span className="detail-label">{t('pages.result.result.nameLabel', 'Student Name')}</span>
                  <span className="detail-value">{activeResult.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('pages.result.result.regLabel', 'Index No')}</span>
                  <span className="detail-value">{activeResult.regNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('pages.result.result.classLabel', 'Class / Stage')}</span>
                  <span className="detail-value">{translateClassName(activeResult.class)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('pages.result.result.examLabel', 'Exam & Year')}</span>
                  <span className="detail-value">
                    {translateExam(activeResult.exam)} ({activeResult.year})
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Marks Table */}
            <div className="result-content">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>{t('pages.result.result.thSubject', 'Subject')}</th>
                    <th style={{ textAlign: 'center' }}>{t('pages.result.result.thMax', 'Maximum Marks')}</th>
                    <th style={{ textAlign: 'right' }}>{t('pages.result.result.thObtained', 'Marks Obtained')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(activeResult.marks || {}).map(([subject, mark]) => (
                    <tr key={subject}>
                      <td>{translateSubject(subject)}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>100</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--accent-emerald)' }}>
                        {String(mark)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Grid */}
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">{t('pages.result.result.totalLabel', 'Total Marks')}</span>
                  <span className="summary-value">{activeResult.total}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('pages.result.result.gradeLabel', 'Grade')}</span>
                  <span className="summary-value">{activeResult.grade}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('pages.result.result.statusLabel', 'Status')}</span>
                  <span
                    className={`status-badge ${
                      activeResult.status.toLowerCase() === 'pass' ? 'status-pass' : 'status-fail'
                    }`}
                  >
                    {activeResult.status.toLowerCase() === 'pass'
                      ? t('pages.result.result.status.pass', 'Pass')
                      : t('pages.result.result.status.fail', 'Fail')}
                  </span>
                </div>
              </div>

              {/* Print signatures */}
              <div className="print-signatures print-only">
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <span className="sig-label">{t('pages.result.result.signatures.0', isTamil ? 'வகுப்பு ஆசிரியர்' : 'Class Teacher')}</span>
                </div>
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <span className="sig-label">{t('pages.result.result.signatures.2', isTamil ? 'அதிபர்' : 'Principal')}</span>
                </div>
              </div>

              {/* Print Footer Info */}
              <div className="print-footer-info print-only">
                <span>{t('pages.result.result.footerPrefix', isTamil ? 'திகதி:' : 'Date:')} {currentDateFormatted}</span>
                <span>{t('pages.result.result.footerCenter', isTamil ? "தாறுத் தஃவா அல்குர்ஆன் மனனக் கல்லூரி — உத்தியோகபூர்வ ஆவணம்" : "Institute of Da'wa Islamiyya — Official Records")}</span>
              </div>

              {/* Print Button */}
              <div style={{ marginTop: '4rem', textAlign: 'center' }} className="no-print">
                <button
                  type="button"
                  id="print-result-btn"
                  className="btn btn-primary"
                  onClick={handlePrint}
                  style={{ padding: '1rem 3rem', fontSize: '1rem' }}
                >
                  <i className="fa-solid fa-print" style={{ marginRight: '12px' }}></i>
                  {t('pages.result.result.printBtn', 'Print Official Marksheet')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
