import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function HistoryPage() {
  const { floorPlan, workoutLogs } = useApp();
  const [filter, setFilter] = useState('all');

  const allLogs = Object.entries(workoutLogs).flatMap(([machineId, logs]) => {
    const machine = floorPlan.find(m => m.id === machineId);
    return logs.map(l => ({ ...l, machine }));
  }).filter(l => l.machine).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = filter === 'all' ? allLogs : allLogs.filter(l => l.machine?.category === filter);

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const totalSets = allLogs.filter(l => l.sets).reduce((a, b) => a + Number(b.sets || 0), 0);
  const totalMins = allLogs.filter(l => l.duration).reduce((a, b) => a + Number(b.duration || 0), 0);
  const uniqueDays = new Set(allLogs.map(l => new Date(l.date).toDateString())).size;

  return (
    <div style={styles.page}>
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span style={styles.statNum}>{allLogs.length}</span>
          <span style={styles.statLabel}>Total Logs</span>
        </div>
        <div style={styles.statDiv} />
        <div style={styles.stat}>
          <span style={styles.statNum}>{totalSets}</span>
          <span style={styles.statLabel}>Total Sets</span>
        </div>
        <div style={styles.statDiv} />
        <div style={styles.stat}>
          <span style={styles.statNum}>{totalMins}</span>
          <span style={styles.statLabel}>Cardio Mins</span>
        </div>
        <div style={styles.statDiv} />
        <div style={styles.stat}>
          <span style={styles.statNum}>{uniqueDays}</span>
          <span style={styles.statLabel}>Days Trained</span>
        </div>
      </div>

      <div style={styles.filters}>
        {['all', 'strength', 'cardio', 'free_weights'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}>
            {f === 'free_weights' ? 'FREE WEIGHTS' : f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🏋️</p>
            <p style={styles.emptyText}>No workouts logged yet.</p>
            <p style={styles.emptyHint}>Head to the floor plan and click a machine to get started.</p>
          </div>
        ) : filtered.map(log => (
          <div key={log.id} style={styles.logCard}>
            <div style={styles.logLeft}>
              <span style={styles.logIcon}>{log.machine?.icon}</span>
            </div>
            <div style={styles.logBody}>
              <div style={styles.logName}>{log.machine?.label}</div>
              {log.exercise && <div style={styles.logExercise}>{log.exercise}</div>}
              <div style={styles.logDetails}>
                {log.machine?.category === 'cardio'
                  ? `${log.duration || '?'} min${log.speed ? ` @ ${log.speed}` : ''}${log.resistance ? ` | ${log.resistance}` : ''}`
                  : `${log.weight ? `${log.weight} lbs` : ''}${log.reps ? ` × ${log.reps} reps` : ''}${log.sets ? ` × ${log.sets} sets` : ''}`
                }
              </div>
              {log.notes && <div style={styles.logNotes}>"{log.notes}"</div>}
            </div>
            <div style={styles.logDate}>{fmtDate(log.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0a0a' },
  statsBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap',
  },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' },
  statNum: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '36px', color: '#e63946', lineHeight: 1 },
  statLabel: { fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', marginTop: '4px' },
  statDiv: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' },
  filters: { display: 'flex', gap: '6px', padding: '16px 20px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
    fontFamily: '"Bebas Neue", sans-serif', fontSize: '12px', letterSpacing: '1px', transition: 'all 0.2s',
  },
  filterActive: { background: '#e63946', borderColor: '#e63946', color: '#fff' },
  list: { flex: 1, overflowY: 'auto', padding: '0 20px 20px' },
  logCard: {
    display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px',
    background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', marginBottom: '8px',
  },
  logLeft: { flexShrink: 0 },
  logIcon: { fontSize: '28px' },
  logBody: { flex: 1 },
  logName: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', color: '#fff', letterSpacing: '1px' },
  logExercise: { color: '#f4a261', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, marginBottom: '4px' },
  logDetails: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', margin: '4px 0' },
  logNotes: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', fontStyle: 'italic' },
  logDate: { color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', flexShrink: 0, textAlign: 'right' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px' },
  emptyText: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: 'rgba(255,255,255,0.3)', margin: 0 },
  emptyHint: { fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.2)', marginTop: '8px', textAlign: 'center' },
};
