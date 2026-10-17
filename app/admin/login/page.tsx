'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../admin.css';
import { IDISupabase } from '../../../lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    async function checkExistingAuth() {
      try {
        const user = await IDISupabase.getUser();
        if (user) {
          const isAdmin = await IDISupabase.checkIsAdmin(user.id);
          if (isAdmin) {
            router.replace('/admin/dashboard');
          }
        }
      } catch (err) {
        console.warn('Session check:', err);
      }
    }
    checkExistingAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!IDISupabase.isConfigured()) {
      setErrorMessage('Supabase credentials have not been configured yet.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await IDISupabase.signIn(email.trim(), password);
      if (error) {
        setErrorMessage(error);
        setLoading(false);
        return;
      }

      router.replace('/admin/dashboard');
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to sign in. Please check your credentials and network connection.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="login-card">
        <div className="login-header">
          <Image
            src="/assets/images/idi_logo.webp"
            alt="IDI Logo"
            className="login-logo"
            width={80}
            height={80}
            priority
          />
          <h1>Admin Portal</h1>
          <p>Sign in to manage gallery albums, contact inquiries, and website operations</p>
        </div>

        {errorMessage && (
          <div id="login-alert" className="alert alert-danger" style={{ display: 'flex' }}>
            <i className="fa-solid fa-circle-exclamation"></i>
            <span id="login-alert-text">{errorMessage}</span>
          </div>
        )}

        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder="admin@idi.edu"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              className="form-input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            id="btn-login"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <span id="btn-login-spinner">
                <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
              </span>
            ) : (
              <span id="btn-login-text">
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
              </span>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <Link
            href="/gallery"
            style={{ color: 'var(--accent-emerald)', textDecoration: 'none', fontWeight: 600 }}
          >
            <i className="fa-solid fa-arrow-left"></i> Return to Public Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
