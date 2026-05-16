import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FREE_WEIGHT_EXERCISES } from '../utils/machines';

export default function WorkoutModal({ machine, onClose }) {
  const { logWorkout, getMachineLogs, getLastLog, getRecommendation } = useApp();
  const isCardio = machine.category === 'cardio';
  const isFreeWeights = machine.category === 'free_weights';
  const lastLog = getLastLog(machine.id);
  const recommendation = getRecommendation(machine);
  const logs = getMachineLogs(machine.id).slice(-5).reverse();

  const [tab, setTab] = useState('log');
  const [form, setForm] = useState({
    weight: lastLog?.weight || '',
    reps: lastLog?.reps || '',
    sets: lastLog?.sets || '',
    duration: lastLog?.duration || '',
    speed: lastLog?.speed || '',
    resistance: lastLog?.resistance || '',
    exercise: FREE_WEIGHT_EXERCISES[0]?.name || '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    logWorkout(machine.id, { ...form, machineName: machine.label });
    onClose();
  };

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{machine.icon} {machine.label}</h2>
            <p style={styles.sub}>{machine.muscleGroup}</p>
          </div>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>

        <div style={styles.tabs}>
          {['log', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}>
              {t === 'log' ? 'LOG WORKOUT' : 'HISTORY'}
            </button>
          ))}
        </div>

        {tab === 'log' && (
          <form onSubmit={handleSubmit} style={styles.form}>
            {recommendation && !isFreeWeights && (
              <div style={styles.rec}>
                💡 Based on similar machines, try starting at <strong>{recommendation} lbs</strong>
              </div>
            )}
            {lastLog && (
              <div style={styles.lastLog}>
                Last: {isCardio
                  ? `${lastLog.duration || '?'} min @ ${lastLog.speed || '?'} ${lastLog.resistance ? `| Res: ${lastLog.resistance}` : ''}`
                  : `${lastLog.weight || '?'} lbs × ${lastLog.reps || '?'} reps × ${lastLog.sets || '?'} sets`}
              </div>
            )}

            {isFreeWeights && (
              <div style={styles.field}>
                <label style={styles.label}>EXERCISE</label>
                <select style={styles.select} value={form.exercise}
                  onChange={e => setForm({ ...form, exercise: e.target.value })}>
                  {FREE_WEIGHT_EXERCISES.map(ex => (
                    <option key={ex.name} value={ex.name}>{ex.name} ({ex.muscleGroup})</option>
                  ))}
                </select>
              </div>
            )}

            {isCardio ? (
              <>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>DURATION (min)</label>
                    <input style={styles.input} type="number" min="1" placeholder="30"
                      value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>SPEED / LEVEL</label>
                    <input style={styles.input} type="text" placeholder="6.5 mph"
                      value={form.speed} onChange={e => setForm({ ...form, speed: e.target.value })} />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>RESISTANCE / INCLINE</label>
                  <input style={styles.input} type="text" placeholder="Level 8 / 2% incline"
                    value={form.resistance} onChange={e => setForm({ ...form, resistance: e.target.value })} />
                </div>
              </>
            ) : (
              <>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>WEIGHT (lbs)</label>
                    <input style={styles.input} type="number" min="0" placeholder={recommendation || '50'}
                      value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>REPS</label>
                    <input style={styles.input} type="number" min="1" placeholder="10"
                      value={form.reps} onChange={e => setForm({ ...form, reps: e.target.value })} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>SETS</label>
                    <input style={styles.input} type="number" min="1" placeholder="3"
                      value={form.sets} onChange={e => setForm({ ...form, sets: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <div style={styles.field}>
              <label style={styles.label}>NOTES (optional)</label>
              <input style={styles.input} type="text" placeholder="How did it feel?"
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button type="submit" style={styles.saveBtn}>SAVE WORKOUT ✓</button>
          </form>
        )}

        {tab === 'history' && (
          <div style={styles.history}>
            {logs.length === 0 ? (
              <p style={styles.empty}>No workouts logged yet on this machine.</p>
            ) : logs.map(log => (
              <div key={log.id} style={styles.logItem}>
                <div style={styles.logDate}>{fmtDate(log.date)}</div>
                {log.exercise && <div style={styles.logExercise}>{log.exercise}</div>}
                <div style={styles.logDetails}>
                  {isCardio
                    ? `${log.duration || '?'} min @ ${log.speed || '?'}${log.resistance ? ` | ${log.resistance}` : ''}`
                    : `${log.weight || '?'} lbs × ${log.reps || '?'} reps × ${log.sets || '?'} sets`
                  }
                </div>
                {log.notes && <div style={styles.logNotes}>"{log.notes}"</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '20px',
  },
  modal: {
    background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
    width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '24px 24px 16px',
  },
  title: { margin: 0, fontFamily: '"Bebas Neue", sans-serif', fontSize: '26px', color: '#fff', letterSpacing: '1px' },
  sub: { margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' },
  close: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer', padding: '4px' },
  tabs: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' },
  tabBtn: {
    padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
    fontFamily: '"Bebas Neue", sans-serif', fontSize: '13px', letterSpacing: '2px',
    color: 'rgba(255,255,255,0.3)', borderBottom: '2px solid transparent', transition: 'all 0.2s',
  },
  tabActive: { color: '#e63946', borderBottomColor: '#e63946' },
  form: { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' },
  rec: {
    background: 'rgba(42,157,143,0.15)', border: '1px solid rgba(42,157,143,0.3)',
    borderRadius: '8px', padding: '10px 14px', color: '#2a9d8f',
    fontSize: '13px', fontFamily: '"DM Sans", sans-serif',
  },
  lastLog: {
    background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 14px',
    color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: '"JetBrains Mono", monospace',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  row: { display: 'flex', gap: '10px' },
  label: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)' },
  input: {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '10px 14px', color: '#fff', fontSize: '15px', fontFamily: '"DM Sans", sans-serif',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  select: {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '10px 14px', color: '#fff', fontSize: '14px', fontFamily: '"DM Sans", sans-serif',
    outline: 'none', width: '100%',
  },
  saveBtn: {
    background: '#e63946', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '14px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '16px',
    letterSpacing: '2px', cursor: 'pointer', marginTop: '4px',
  },
  history: { padding: '16px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  empty: { color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Sans", sans-serif', textAlign: 'center', padding: '20px' },
  logItem: {
    background: '#1a1a1a', borderRadius: '10px', padding: '14px 16px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  logDate: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', marginBottom: '4px' },
  logExercise: { color: '#f4a261', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, marginBottom: '4px' },
  logDetails: { color: '#fff', fontSize: '15px', fontFamily: '"JetBrains Mono", monospace' },
  logNotes: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', fontStyle: 'italic', marginTop: '6px' },
};
