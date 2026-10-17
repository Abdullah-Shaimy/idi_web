'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function SecurityProvider({ children }) {
  const pathname = usePathname();
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const toastTimerRef = useRef(null);
  const shieldTimerRef = useRef(null);

  // Check if current page allows printing
  const isPrintAllowed = pathname === '/result';

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  const showShield = (msg) => {
    setShieldActive(true);
    if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
    shieldTimerRef.current = setTimeout(() => {
      setShieldActive(false);
    }, 1000);
  };

  useEffect(() => {
    // Don't enforce protections in admin routes or open route if needed
    if (pathname.startsWith('/admin')) {
      return;
    }

    const isEditable = (el) => {
      return el && el.closest && el.closest('input, textarea, select, option, [contenteditable="true"]');
    };

    const isWhitelisted = (el) => {
      return el && el.closest && el.closest('[data-allow-copy], [data-allow-context-menu]');
    };

    const handleContextMenu = (e) => {
      if (isEditable(e.target) || isWhitelisted(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      showToast('Right-click is disabled on this page.');
    };

    const handleSelectStart = (e) => {
      if (isEditable(e.target) || isWhitelisted(e.target)) return;
      e.preventDefault();
      showToast('Text selection is disabled on this page.');
    };

    const handleCopy = (e) => {
      if (isEditable(e.target) || isWhitelisted(e.target)) return;
      e.preventDefault();
      showToast('Copy is disabled on this page.');
    };

    const handleCut = (e) => {
      if (isEditable(e.target) || isWhitelisted(e.target)) return;
      e.preventDefault();
      showToast('Cut is disabled on this page.');
    };

    const handleDragStart = (e) => {
      if (isEditable(e.target)) return;
      if (e.target && (e.target.tagName === 'IMG' || e.target.closest('img, .protected-content'))) {
        e.preventDefault();
        showToast('Dragging protected content is disabled on this page.');
      }
    };

    const handleKeyDown = (e) => {
      if (isEditable(e.target)) return;

      const key = (e.key || '').toUpperCase();
      const hasCommandKey = e.ctrlKey || e.metaKey;

      if (key === 'F12' || (hasCommandKey && e.shiftKey && ['I', 'J', 'C'].includes(key))) {
        e.preventDefault();
        e.stopPropagation();
        showToast('Developer tools are disabled on this page.');
        return;
      }

      if (!hasCommandKey) return;

      const shortcuts = {
        C: 'Copy is disabled on this page.',
        P: 'Printing is disabled on this page.',
        S: 'Saving the page is disabled on this page.',
        U: 'Viewing source is disabled on this page.',
        X: 'Cut is disabled on this page.',
      };

      if (key === 'P' && isPrintAllowed) {
        return; // Allow printing on marksheet
      }

      if (shortcuts[key]) {
        e.preventDefault();
        e.stopPropagation();
        showToast(shortcuts[key]);
        if (key === 'P') {
          showShield(shortcuts[key]);
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
    };
  }, [pathname, isPrintAllowed]);

  return (
    <>
      {children}

      {/* Security Toast Notification */}
      <div
        className={`security-toast ${toastVisible ? 'visible' : ''}`}
        aria-live="polite"
      >
        {toastMessage}
      </div>

      {/* Security Screen Shield */}
      <div className={`security-shield ${shieldActive ? 'active' : ''}`}>
        <p>Protected content</p>
      </div>
    </>
  );
}
