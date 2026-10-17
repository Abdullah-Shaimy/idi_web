'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function AlumniContent() {
  const { t, language, formatOrigin, formatGraduateName } = useLanguage();
  const [alumniData, setAlumniData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/alumni.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load alumni data.');
        return res.json();
      })
      .then((data) => {
        setAlumniData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading alumni:', err);
        setError(t('pages.alumni.loadError', 'Failed to load alumni data.'));
        setLoading(false);
      });
  }, [t]);

  const filters = [
    { key: 'all', label: t('pages.alumni.filters.all', 'All') },
    { key: '2023', label: t('pages.alumni.filters.2023', '2023') },
    { key: '2024', label: t('pages.alumni.filters.2024', '2024') },
    { key: '2025', label: t('pages.alumni.filters.2025', '2025') },
    { key: '2026', label: t('pages.alumni.filters.2026', '2026') },
    { key: 'Upcoming', label: t('pages.alumni.filters.Upcoming', 'Upcoming') },
    { key: 'Exam-New', label: t('pages.alumni.filters.Exam-New', 'Exam-New') },
  ];

  const getBadgeLabel = (batch) => {
    if (batch === 'Upcoming') {
      return t('pages.alumni.badge.upcoming', 'Ready to Upcoming');
    }
    if (batch === 'Exam-New') {
      return t('pages.alumni.badge.examNew', 'Preparing to Exam');
    }
    if (language === 'ta') {
      return batch + ' ' + t('pages.alumni.badge.convocation', 'பட்டமளிப்பு');
    }
    return t('pages.alumni.badge.convocation', 'Convocation') + ' ' + batch;
  };

  const filteredAlumni =
    selectedFilter === 'all'
      ? alumniData
      : alumniData.filter((a) => a.batch === selectedFilter);

  const normalizeImgSrc = (src) => {
    if (!src) return '/assets/images/alumni_profile.webp';
    if (src.startsWith('http')) return src;
    return src.startsWith('/') ? src : '/' + src;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.alumni.hero.subtitle', 'Our Legacy')}</span>
          <h1>{t('pages.alumni.hero.title', 'The Torchbearers')}</h1>
          <p>
            {t(
              'pages.alumni.hero.copy',
              'Celebrating our graduates who carry the light of the Quran into the world.'
            )}
          </p>
        </div>
      </section>

      {/* Alumni Directory */}
      <section className="section-container">
        <div className="section-title-wrapper">
          <span className="subtitle">{t('pages.alumni.directory.subtitle', 'Directory')}</span>
          <h2 className="section-title">{t('pages.alumni.directory.title', 'Our Graduates')}</h2>
        </div>

        {/* Filters */}
        <div className="filter-container" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '3rem 0' }}>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`filter-btn ${selectedFilter === f.key ? 'active' : ''}`}
              onClick={() => setSelectedFilter(f.key)}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '30px',
                border: '1px solid var(--border-light)',
                background: selectedFilter === f.key ? 'var(--accent-emerald)' : 'var(--bg-secondary)',
                color: selectedFilter === f.key ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'var(--transition)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div id="loading" style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--accent-emerald)' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <br />
            <br />
            {t('pages.alumni.loading', 'Summoning the Graduates...')}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        {/* Alumni Grid */}
        {!loading && !error && (
          <div className="grid-container" id="alumni-grid">
            {filteredAlumni.length === 0 ? (
              <p
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '3rem',
                  color: 'var(--text-muted)',
                }}
              >
                {t('pages.alumni.empty', 'No graduates found for this category.')}
              </p>
            ) : (
              filteredAlumni.map((alumnus) => (
                <div key={alumnus.id} className="alumni-card">
                  {Number(alumnus.id) > 68 && (
                    <span className="new-syllabus-badge">
                      {t('pages.alumni.badge.newSyllabus', 'New Syllabus')}
                    </span>
                  )}
                  <div className="alumni-order-badge">{alumnus.id}</div>

                  <div className="alumni-img-wrapper">
                    <img
                      src={normalizeImgSrc(alumnus.image)}
                      alt={alumnus.name}
                      className="alumni-img"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/alumni_profile.webp';
                      }}
                      draggable="false"
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span className="alumni-batch">{getBadgeLabel(alumnus.batch)}</span>
                  </div>

                  <h3 className="alumni-name">
                    {formatGraduateName ? formatGraduateName(alumnus.name) : alumnus.name}
                  </h3>
                  <p className="alumni-status">{formatOrigin(alumnus.currentStatus)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
}
