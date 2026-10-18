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

  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [mobileOutreachOpen, setMobileOutreachOpen] = useState(false);
  const isTamil = language === 'ta';

  const programsSubmenu = [
    {
      id: 'hifz',
      href: '/hifz#hifz',
      icon: 'fa-solid fa-star-and-crescent',
      title: t('pages.hifz.cat1.title', isTamil ? 'தஹ்ஃபீஸுல் குர்ஆன் (ஹிஃப்ழ்)' : 'Tahfeez-ul-Quran (Hifz)'),
      desc: isTamil ? '4 வருட முறையான மனனப் பாடத்திட்டம்' : '4-Year Full Memorization Track',
    },
    {
      id: 'school',
      href: '/hifz#school',
      icon: 'fa-solid fa-graduation-cap',
      title: t('pages.hifz.cat2.title', isTamil ? 'பாடசாலைக் கல்வி & O/L' : 'School Studies & O/L'),
      desc: isTamil ? 'தரம் 6 - 11 அரச பாடத்திட்டம்' : 'Grades 6–11 National Syllabus',
    },
  ];

  const outreachSubmenu = [
    {
      id: 'school-studies',
      href: '/outreach#school-studies',
      icon: 'fa-solid fa-graduation-cap',
      title: t('pages.outreach.programs.schoolStudies.title', isTamil ? 'பாடசாலைக் கல்வி' : 'School Studies'),
      desc: isTamil ? 'தரம் 6 - 11 O/L அரச பாடத்திட்டம்' : 'Grades 6–11 O/L National Syllabus',
    },
    {
      id: 'special-classes',
      href: '/outreach#special-classes',
      icon: 'fa-solid fa-chalkboard-user',
      title: t('pages.outreach.programs.specialClasses.title', isTamil ? 'விசேட வகுப்புகள்' : 'Special Classes'),
      desc: isTamil ? 'துரிதக் கற்றல் & அரபு மொழி' : 'Remedial Tutoring & Arabic',
    },
    {
      id: 'coaching-seminars',
      href: '/outreach#coaching-seminars',
      icon: 'fa-solid fa-chalkboard',
      title: t('pages.outreach.programs.coachingSeminars.title', isTamil ? 'பயிற்சி கருத்தரங்குகள்' : 'Coaching Seminars'),
      desc: isTamil ? 'பரீட்சை உத்திகள் & வழிகாட்டல்' : 'Exam Strategy & Masterclasses',
    },
    {
      id: 'hijaza-training',
      href: '/outreach#hijaza-training',
      icon: 'fa-solid fa-certificate',
      title: t('pages.outreach.programs.hijazaTraining.title', isTamil ? 'ஹிஜாஸா பயிற்சி' : 'Hijaza Training'),
      desc: isTamil ? 'நபிகளார் வரை சனது தொடர்பு' : 'Sanad Al-Ittisal Certification',
    },
    {
      id: 'personality-development',
      href: '/outreach#personality-development',
      icon: 'fa-solid fa-user-tie',
      title: t('pages.outreach.programs.personalityDevelopment.title', isTamil ? 'ஆளுமை விருத்தி' : 'Personality Development'),
      desc: isTamil ? 'தலைமைத்துவம் & மேடைப் பேச்சு' : 'Leadership & Public Speaking',
    },
    {
      id: 'thrabiya-programme',
      href: '/outreach#thrabiya-programme',
      icon: 'fa-solid fa-hands-praying',
      title: t('pages.outreach.programs.thrabiyaProgramme.title', isTamil ? 'தர்பியா நிகழ்ச்சித்திட்டம்' : 'Thrabiya Programme'),
      desc: isTamil ? 'ஆன்ம சுத்தி & சுன்னாஹ் வாழ்வியல்' : 'Tazkiyah & Murabbi Mentorship',
    },
  ];

  const navLinks = [
    { href: '/', label: t('common.nav.home', 'Home') },
    { href: '/about', label: t('common.nav.about', 'About') },
    { href: '/hifz', label: t('common.nav.programs', t('common.nav.hifz', 'Our Programs')) },
    { href: '/outreach', label: t('common.nav.outreach', 'Outreach') },
    { href: '/students', label: t('common.nav.students', 'Journey') },
    { href: '/alumni', label: t('common.nav.alumni', 'Alumni') },
    { href: '/events', label: t('common.nav.events', 'Events') },
    { href: '/news', label: t('common.nav.news', 'News') },
    { href: '/contact', label: t('common.nav.contact', 'Contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/hifz') return pathname === '/hifz' || pathname === '/programs' || pathname.startsWith('/hifz/') || pathname.startsWith('/programs/');
    if (href === '/outreach') return pathname === '/outreach' || pathname.startsWith('/outreach/');
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
            {navLinks.map((link) => {
              if (link.href === '/hifz') {
                return (
                  <div key={link.href} className="nav-dropdown-wrapper">
                    <Link
                      href="/hifz"
                      className={`nav-dropdown-trigger ${isActive('/hifz') ? 'active' : ''}`}
                    >
                      <span>{link.label}</span>
                      <i className="fa-solid fa-chevron-down nav-dropdown-arrow"></i>
                    </Link>

                    <div className="nav-dropdown-menu">
                      <div className="nav-dropdown-list">
                        {programsSubmenu.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            className="nav-dropdown-link"
                          >
                            <div className="nav-dropdown-icon">
                              <i className={sub.icon}></i>
                            </div>
                            <div className="nav-dropdown-text">
                              <span className="nav-dropdown-title">{sub.title}</span>
                              <span className="nav-dropdown-desc">{sub.desc}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="nav-dropdown-footer">
                        <Link href="/hifz" className="nav-dropdown-all-link">
                          <span>{isTamil ? 'அனைத்து திட்டங்களையும் காண்க' : 'View Dual-Track Programs'}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              if (link.href === '/outreach') {
                return (
                  <div key={link.href} className="nav-dropdown-wrapper">
                    <Link
                      href="/outreach"
                      className={`nav-dropdown-trigger ${isActive('/outreach') ? 'active' : ''}`}
                    >
                      <span>{link.label}</span>
                      <i className="fa-solid fa-chevron-down nav-dropdown-arrow"></i>
                    </Link>

                    <div className="nav-dropdown-menu">
                      <div className="nav-dropdown-list">
                        {outreachSubmenu.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            className="nav-dropdown-link"
                          >
                            <div className="nav-dropdown-icon">
                              <i className={sub.icon}></i>
                            </div>
                            <div className="nav-dropdown-text">
                              <span className="nav-dropdown-title">{sub.title}</span>
                              <span className="nav-dropdown-desc">{sub.desc}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="nav-dropdown-footer">
                        <Link href="/outreach" className="nav-dropdown-all-link">
                          <span>{isTamil ? 'அனைத்து திட்டங்களையும் காண்க' : 'View All Outreach Programs'}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? 'active' : ''}
                >
                  {link.label}
                </Link>
              );
            })}
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
          {navLinks.map((link) => {
            if (link.href === '/hifz') {
              return (
                <div key={link.href} className="mobile-nav-group">
                  <div className="mobile-nav-item-row">
                    <Link
                      href="/hifz"
                      className={isActive('/hifz') ? 'active' : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      className="mobile-dropdown-btn"
                      aria-label="Toggle Our Programs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMobileProgramsOpen((prev) => !prev);
                      }}
                    >
                      <i className={`fa-solid fa-chevron-${mobileProgramsOpen ? 'up' : 'down'}`}></i>
                    </button>
                  </div>
                  {mobileProgramsOpen && (
                    <div className="mobile-submenu-list">
                      {programsSubmenu.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          className="mobile-submenu-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className={sub.icon} style={{ width: '18px', textAlign: 'center' }}></i>
                          <span>{sub.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (link.href === '/outreach') {
              return (
                <div key={link.href} className="mobile-nav-group">
                  <div className="mobile-nav-item-row">
                    <Link
                      href="/outreach"
                      className={isActive('/outreach') ? 'active' : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      className="mobile-dropdown-btn"
                      aria-label="Toggle Outreach Programs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMobileOutreachOpen((prev) => !prev);
                      }}
                    >
                      <i className={`fa-solid fa-chevron-${mobileOutreachOpen ? 'up' : 'down'}`}></i>
                    </button>
                  </div>
                  {mobileOutreachOpen && (
                    <div className="mobile-submenu-list">
                      {outreachSubmenu.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          className="mobile-submenu-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className={sub.icon} style={{ width: '18px', textAlign: 'center' }}></i>
                          <span>{sub.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

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
