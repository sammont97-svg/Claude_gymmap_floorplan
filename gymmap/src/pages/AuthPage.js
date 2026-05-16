import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const { signup, login } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handle = (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'login'
      ? login(form.email, form.password)
      : signup(form.name, form.email, form.password);
    if (result.error) setError(result.error);
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📍</span>
          <h1 style={styles.logoText}>GYMMAP</h1>
        </div>
        <p style={styles.tagline}>Map your gym. Track your gains.</p>

        <div style={styles.tabs}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}>
              {m === 'login' ? 'LOG IN' : 'SIGN UP'}
            </button>
          ))}
        </div>

        <form onSubmit={handle} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.field}>
              <label style={styles.label}>NAME</label>
              <input style={styles.input} type="text" required placeholder="Your name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>EMAIL</label>
            <input style={styles.input} type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input style={styles.input} type="password" required placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn}>
            {mode === 'login' ? 'ENTER THE GYM →' : 'CREATE ACCOUNT →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0a', position: 'relative', overflow: 'hidden', padding: '20px',
  },
  bg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 20% 50%, rgba(230,57,70,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(42,157,143,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '48px 40px', width: '100%', maxWidth: '420px',
    position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  logoIcon: { fontSize: '32px' },
  logoText: {
    fontFamily: '"Bebas Neue", sans-serif', fontSize: '42px', color: '#fff',
    margin: 0, letterSpacing: '4px',
  },
  tagline: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px', fontFamily: '"DM Sans", sans-serif', letterSpacing: '1px' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '28px', background: '#111', borderRadius: '8px', padding: '4px' },
  tab: {
    flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontFamily: '"Bebas Neue", sans-serif', fontSize: '14px', letterSpacing: '2px',
    color: 'rgba(255,255,255,0.4)', background: 'transparent', transition: 'all 0.2s',
  },
  tabActive: { background: '#e63946', color: '#fff' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '12px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' },
  input: {
    background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '12px 16px', color: '#fff', fontSize: '15px', fontFamily: '"DM Sans", sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
  },
  error: { color: '#e63946', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', margin: 0 },
  btn: {
    background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '14px', fontSize: '14px', letterSpacing: '2px', cursor: 'pointer',
    fontFamily: '"Bebas Neue", sans-serif', marginTop: '8px', transition: 'opacity 0.2s',
  },
};
