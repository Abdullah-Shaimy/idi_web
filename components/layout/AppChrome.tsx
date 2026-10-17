'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import LanguageModal from './LanguageModal';

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isOpen = pathname === '/open';
  const isCustomView = isAdmin || isOpen;

  return (
    <>
      {!isCustomView && <Header />}
      {children}
      {!isCustomView && <Footer />}
      {!isAdmin && <LanguageModal />}
    </>
  );
}
