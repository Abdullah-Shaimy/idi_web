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
    { href: '/hifz', label: t('common.nav.hifz', 'Hifz Program') },
    { href: '/students', label: t('common.nav.students', 'Journey') },
    { href: '/alumni', label: t('common.nav.alumni', 'Alumni') },
    { href: '/events', label: t('common.nav.events', 'Events') },
    { href: '/news', label: t('common.nav.news', 'News') },
    { href: '/contact', label: t('common.nav.contact', 'Contact') },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
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
          <div className="lang-switch desktop-lang-switch">
            <button
              type="button"
              className={`lang-switch-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en', true)}
              title="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-switch-btn ${language === 'ta' ? 'active' : ''}`}
              onClick={() => setLanguage('ta', true)}
              title="தமிழுக்கு மாறவும்"
            >
              தமிழ்
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Drawer */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}>
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
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className={`btn ${language === 'en' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
              onClick={() => {
                setLanguage('en', true);
                setMobileMenuOpen(false);
              }}
            >
              English
            </button>
            <button
              type="button"
              className={`btn ${language === 'ta' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
              onClick={() => {
                setLanguage('ta', true);
                setMobileMenuOpen(false);
              }}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
