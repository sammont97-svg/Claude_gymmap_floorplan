import React from 'react';
import { useApp } from '../context/AppContext';

export default function NavBar({ page, setPage }) {
  const { user, logout, floorPlan, workoutLogs } = useApp();
  const totalLogs = Object.values(workoutLogs).reduce((a, b) => a + b.length, 0);

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>📍</span>
        <span style={styles.brandName}>GYMMAP</span>
      </div>

      <div style={styles.navItems}>
        <button onClick={() => setPage('floor')}
          style={{ ...styles.navBtn, ...(page === 'floor' ? styles.navActive : {}) }}>
          <span style={styles.navIcon}>🗺️</span>
          <span style={styles.navLabel}>FLOOR PLAN</span>
          {floorPlan.length > 0 && <span style={styles.badge}>{floorPlan.length}</span>}
        </button>
        <button onClick={() => setPage('history')}
          style={{ ...styles.navBtn, ...(page === 'history' ? styles.navActive : {}) }}>
          <span style={styles.navIcon}>📊</span>
          <span style={styles.navLabel}>HISTORY</span>
          {totalLogs > 0 && <span style={styles.badge}>{totalLogs}</span>}
        </button>
      </div>

      <div style={styles.userArea}>
        <span style={styles.userName}>{user?.name}</span>
        <button onClick={logout} style={styles.logoutBtn}>LOG OUT</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', height: '56px', background: '#111',
    borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
    position: 'relative', zIndex: 10,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandIcon: { fontSize: '20px' },
  brandName: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', color: '#fff', letterSpacing: '3px' },
  navItems: { display: 'flex', gap: '4px' },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
    background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontFamily: '"Bebas Neue", sans-serif', fontSize: '13px', letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s', position: 'relative',
  },
  navActive: { background: 'rgba(230,57,70,0.15)', color: '#e63946' },
  navIcon: { fontSize: '16px' },
  navLabel: {},
  badge: {
    background: '#e63946', color: '#fff', borderRadius: '10px', fontSize: '10px',
    padding: '1px 6px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
  },
  userArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: '"DM Sans", sans-serif' },
  logoutBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
    color: 'rgba(255,255,255,0.4)', padding: '6px 12px', cursor: 'pointer',
    fontFamily: '"Bebas Neue", sans-serif', fontSize: '11px', letterSpacing: '1px',
  },
};
