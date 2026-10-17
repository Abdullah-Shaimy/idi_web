'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IDISupabase } from '../../../lib/supabaseClient';
import MailboxManager from '../../../components/admin/mailbox/MailboxManager';

export default function AdminMailboxPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await IDISupabase.getUser();
        if (!user) {
          router.replace('/admin/login');
          return;
        }

        const profile = await IDISupabase.getAdminProfile(user.id);
        if (!profile) {
          await IDISupabase.signOut();
          router.replace('/admin/login');
          return;
        }

        setCurrentUser(user);
        setAdminProfile(profile);
        setAuthLoading(false);
      } catch (err) {
        console.error('Admin Auth Check Failed:', err);
        router.replace('/admin/login');
      }
    }
    initAuth();
  }, [router]);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-spinner fa-spin fa-3x" style={{ color: 'var(--accent-emerald)' }}></i>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal-wrapper">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <Link href="/admin/dashboard" className="admin-brand">
          <Image
            src="/assets/images/idi_logo.webp"
            alt="IDI Logo"
            width={40}
            height={40}
            priority
          />
          <div className="admin-brand-text">
            <h2>Institute of Da&apos;wa Islamiyya</h2>
            <span id="nav-portal-title">Admin Management Portal</span>
          </div>
        </Link>

        <div className="admin-nav-actions">
          <Link href="/admin/dashboard" className="btn btn-secondary btn-sm">
            <i className="fa-solid fa-arrow-left"></i> Dashboard
          </Link>
          <div className="admin-user-badge">
            <div className="admin-user-avatar">
              {(adminProfile?.full_name || currentUser?.email || 'A')[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              {currentUser?.email}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-container" style={{ marginTop: '1.5rem' }}>
        <div className="admin-section-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h2>
              <i className="fa-solid fa-inbox" style={{ color: 'var(--accent-emerald)' }}></i> Official Admin Mailbox
            </h2>
            <p>Direct portal to send, receive, compose, and organize domain emails</p>
          </div>
        </div>
        <MailboxManager
          adminProfile={adminProfile}
          isSuperAdmin={adminProfile?.role === 'super_admin'}
        />
      </main>
    </div>
  );
}
