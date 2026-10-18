'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: t('common.nav.home', 'Home') },
    { href: '/about', label: t('common.nav.about', 'About') },
    { href: '/hifz', label: t('common.nav.programs', t('common.nav.hifz', 'Our Programs')) },
    { href: '/students', label: t('common.nav.students', 'Journey') },
    { href: '/alumni', label: t('common.nav.alumni', 'Alumni') },
    { href: '/events', label: t('common.nav.events', 'Events') },
    { href: '/news', label: t('common.nav.news', 'News') },
    { href: '/contact', label: t('common.nav.contact', 'Contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/hifz') return pathname === '/hifz' || pathname === '/programs' || pathname.startsWith('/hifz/') || pathname.startsWith('/programs/');
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <Link href="/" className="logo-container">
            <img src="/assets/images/idi_logo.webp" alt="IDI Logo" />
          </Link>

          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </button>

          <nav className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Language Switch */}
          <div className="lang-switch desktop-lang-switch notranslate" translate="no">
            <button
              type="button"
              className={`lang-switch-btn notranslate ${language === 'en' ? 'active' : ''}`}
              translate="no"
              onClick={() => setLanguage('en', true)}
              title="Switch to English"
            >
              {t('common.switcher.en', 'ENGLISH')}
            </button>
            <button
              type="button"
              className={`lang-switch-btn notranslate ${language === 'ta' ? 'active' : ''}`}
              translate="no"
              onClick={() => setLanguage('ta', true)}
              title="Switch to Tamil"
            >
              <span lang="ta" translate="no" className="notranslate">
                {t('common.switcher.ta', 'தமிழ்')}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Drawer */}
      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          className="close-menu-btn"
          aria-label="Close Menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          &times;
        </button>

        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Language Switcher */}
          <div className="mobile-lang-switch-wrap">
            <div className="lang-switch notranslate" translate="no">
              <button
                type="button"
                className={`lang-switch-btn notranslate ${language === 'en' ? 'active' : ''}`}
                translate="no"
                onClick={() => {
                  setLanguage('en', true);
                  setMobileMenuOpen(false);
                }}
                title="Switch to English"
              >
                {t('common.switcher.en', 'ENGLISH')}
              </button>
              <button
                type="button"
                className={`lang-switch-btn notranslate ${language === 'ta' ? 'active' : ''}`}
                translate="no"
                onClick={() => {
                  setLanguage('ta', true);
                  setMobileMenuOpen(false);
                }}
                title="Switch to Tamil"
              >
                <span lang="ta" translate="no" className="notranslate">
                  {t('common.switcher.ta', 'தமிழ்')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
