'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>{t('common.footer.brandTitle', "INSTITUTE OF DA'WA ISLAMIYYA")}</h3>
          <p>
            {t(
              'common.footer.brandCopy',
              'A center of excellence for Quranic memorization and Islamic education, nurturing the next generation of scholars.'
            )}
          </p>
          <div className="social-links" style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', fontSize: '1.2rem' }}>
            <a href="#" style={{ color: 'var(--accent-emerald)' }} aria-label="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" style={{ color: 'var(--accent-emerald)' }} aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" style={{ color: 'var(--accent-emerald)' }} aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>{t('common.footer.quickLinks', 'Quick Links')}</h3>
          <ul className="footer-links">
            <li><Link href="/about">{t('common.footer.aboutUs', 'About Us')}</Link></li>
            <li><Link href="/hifz">{t('common.nav.programs', t('common.nav.hifz', 'Our Programs'))}</Link></li>
            <li><Link href="/outreach">{t('common.nav.outreach', 'Outreach')}</Link></li>
            <li><Link href="/students">{t('common.footer.studentLife', 'Journey')}</Link></li>
            <li><Link href="/events">{t('common.nav.events', 'Events')}</Link></li>
            <li><Link href="/news">{t('common.nav.news', 'News')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t('common.footer.information', 'Information')}</h3>
          <ul className="footer-links">
            <li><Link href="/contact">{t('common.footer.contactUs', 'Contact Us')}</Link></li>
            <li><Link href="/alumni">{t('common.footer.ourAlumni', 'Our Alumni')}</Link></li>
            <li><Link href="/result">{t('common.footer.checkResults', 'Check Results')}</Link></li>
            <li><Link href="/hifz">{t('common.footer.admissions', 'Admissions')}</Link></li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h3>{t('common.footer.contact', 'Contact')}</h3>
          <p><i className="fa-solid fa-location-dot"></i> {t('common.footer.address', '123 Madrasa Lane, City')}</p>
          <p><i className="fa-solid fa-phone"></i> {t('common.footer.phone', '+1 234 567 890')}</p>
          <p><i className="fa-solid fa-envelope"></i> {t('common.footer.email', 'info@idi.edu')}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p dangerouslySetInnerHTML={{ __html: t('common.footer.rights', "&copy; 2026 Institute of Da'wa Islamiyya. All rights reserved.") }} />
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.6 }}>
          {t('common.footer.designedBy', 'Web Solution by')}{' '}
          <a
            href="https://nanovext.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: 'var(--accent-emerald)' }}
          >
            NanoVext
          </a>
        </p>
      </div>
    </footer>
  );
}
