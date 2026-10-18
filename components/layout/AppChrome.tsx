'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import LanguageModal from './LanguageModal';

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isOpen = pathname === '/open';
  const isCustomView = isAdmin || isOpen;

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setScrollProgress(scrolled);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <>
      {!isAdmin && (
        <div
          className="global-scroll-progress-line"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      )}
      {!isCustomView && <Header />}
      {children}
      {!isCustomView && <Footer />}
      {!isAdmin && <LanguageModal />}
    </>
  );
}
