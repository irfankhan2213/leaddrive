'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div className="panel panel-pad" style={{ padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Check your email</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            We sent a confirmation link to <strong style={{ color: 'var(--ink)' }}>{email}</strong>.
            Click the link to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="brand-mark" style={{ margin: '0 auto 16px', width: 44, height: 44, fontSize: 20 }}>L</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Create your account</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Start automating your outreach in minutes</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="panel panel-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: '#fff1f2',
            color: '#e11d48',
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid rgba(225,29,72,0.15)',
          }}>
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            className="field"
            placeholder="Jane Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="field"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="field"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            className="field"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>Sign in</a>
        </p>
      </form>
    </div>
  );
}
