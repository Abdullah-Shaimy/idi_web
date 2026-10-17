'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <main className="error-section">
      <div className="error-card">
        <div className="error-badge">404</div>
        <h1 className="error-title">
          {isTamil ? 'பக்கம் காணப்படவில்லை' : 'Page Not Found'}
        </h1>
        <p className="error-desc">
          {isTamil
            ? 'நீங்கள் தேடும் பக்கம் மாற்றப்பட்டிருக்கலாம், பெயர் மாற்றப்பட்டிருக்கலாம் அல்லது தற்காலிகமாக கிடைக்காமல் இருக்கலாம். முகவரியைச் சரிபார்க்கவும் அல்லது கீழே உள்ள இணைப்புகளைப் பயன்படுத்தவும்.'
            : 'The page you are looking for might have been moved, renamed, or is temporarily unavailable. Please check the URL or use the navigation below to find your way back.'}
        </p>

        <div className="error-actions">
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-house" style={{ marginRight: '0.5rem' }}></i>{' '}
            {isTamil ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}
          </Link>
          <Link href="/contact" className="btn btn-outline">
            <i className="fa-solid fa-envelope" style={{ marginRight: '0.5rem' }}></i>{' '}
            {isTamil ? 'தொடர்பு கொள்ள' : 'Contact Support'}
          </Link>
        </div>

        <div className="quick-nav-links">
          <Link href="/about">{isTamil ? 'எங்களை பற்றி' : 'About Us'}</Link>
          <Link href="/hifz">{isTamil ? 'ஹிஃப்ழ் பாடத்திட்டம்' : 'Hifz Program'}</Link>
          <Link href="/students">{isTamil ? 'எங்கள் பயணம்' : 'Our Journey'}</Link>
          <Link href="/gallery">{isTamil ? 'புகைப்படங்கள்' : 'Photo Gallery'}</Link>
          <Link href="/result">{isTamil ? 'தேர்வு முடிவுகள்' : 'Check Exam Results'}</Link>
        </div>
      </div>
    </main>
  );
}
