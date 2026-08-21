'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Middleware will handle the redirect
    window.location.href = '/dashboard';
  }

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="brand-mark" style={{ margin: '0 auto 16px', width: 44, height: 44, fontSize: 20 }}>L</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Welcome back</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Sign in to your LeadDrive account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="panel panel-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="field"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Don&apos;t have an account?{' '}
          <a href="/signup" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
        </p>
      </form>
    </div>
  );
}
