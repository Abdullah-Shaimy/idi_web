'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroSlider() {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    '/assets/images/hero_bg.webp',
    '/assets/images/hero_bg2.webp',
    '/assets/images/hero_bg3.webp',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url('${src}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
        ))}
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content page-enter">
        <span className="subtitle">
          {t('pages.index.hero.subtitle', 'Bismillahir Rahmanir Rahim')}
        </span>
        <h1>{t('pages.index.hero.title', 'Nurturing Hearts with the Light of Quran')}</h1>
        <p>
          {t(
            'pages.index.hero.copy',
            "Welcome to the Institute of Da'wa Islamiyya, a dedicated Hifz academy committed to Quranic memorization, spiritual growth, and Islamic values."
          )}
        </p>
        <div className="hero-btns">
          <Link href="/about" className="btn btn-primary">
            {t('pages.index.hero.primary', 'Discover More')}
          </Link>
          <Link
            href="/contact"
            className="btn btn-outline"
            style={{ color: 'white', borderColor: 'white' }}
          >
            {t('pages.index.hero.secondary', 'Get in Touch')}
          </Link>
        </div>
      </div>
    </section>
  );
}
