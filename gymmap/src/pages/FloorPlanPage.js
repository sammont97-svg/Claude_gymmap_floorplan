import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_MACHINES } from '../utils/machines';
import { v4 as uuidv4 } from 'uuid';
import WorkoutModal from '../components/WorkoutModal';

const GRID_COLS = 12;
const GRID_ROWS = 10;
const CELL = 64;

export default function FloorPlanPage() {
  const { floorPlan, updateFloorPlan, setActiveLog } = useApp();
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [logModal, setLogModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = useRef(null);

  const filteredMachines = PRESET_MACHINES.filter(m =>
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMachineAt = (col, row) =>
    floorPlan.find(m => m.col === col && m.row === row);

  const handleDragStartPalette = (e, preset) => {
    e.dataTransfer.setData('palette', JSON.stringify(preset));
  };

  const handleDragStartGrid = (e, machine) => {
    setDragging(machine);
    e.dataTransfer.setData('grid', machine.id);
  };

  const handleDrop = (e, col, row) => {
    e.preventDefault();
    const existing = getMachineAt(col, row);

    const paletteData = e.dataTransfer.getData('palette');
    if (paletteData) {
      const preset = JSON.parse(paletteData);
      if (existing) return;
      const newMachine = { ...preset, id: uuidv4(), col, row, label: preset.type };
      updateFloorPlan([...floorPlan, newMachine]);
      setDragOver(null);
      return;
    }

    const gridId = e.dataTransfer.getData('grid');
    if (gridId && dragging) {
      if (existing && existing.id !== gridId) return;
      const updated = floorPlan.map(m =>
        m.id === gridId ? { ...m, col, row } : m
      );
      updateFloorPlan(updated);
      setDragging(null);
      setDragOver(null);
    }
  };

  const removeMachine = (id) => {
    updateFloorPlan(floorPlan.filter(m => m.id !== id));
    setSelectedMachine(null);
  };

  const categoryColor = (cat) => {
    if (cat === 'cardio') return '#2a9d8f';
    if (cat === 'free_weights') return '#f4a261';
    return '#e63946';
  };

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <button style={styles.addBtn} onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? '✕ Close' : '+ Add Machine'}
          </button>
          <div style={styles.legend}>
            <span style={{ ...styles.dot, background: '#e63946' }} /> Strength
            <span style={{ ...styles.dot, background: '#2a9d8f' }} /> Cardio
            <span style={{ ...styles.dot, background: '#f4a261' }} /> Free Weights
          </div>
        </div>
        <p style={styles.hint}>Drag machines onto the grid • Click to log workout</p>
      </div>

      <div style={styles.workspace}>
        {/* Sidebar */}
        {showSidebar && (
          <div style={styles.sidebar}>
            <input
              style={styles.search}
              placeholder="Search machines..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div style={styles.palette}>
              {filteredMachines.map(m => (
                <div
                  key={m.type}
                  draggable
                  onDragStart={e => handleDragStartPalette(e, m)}
                  style={{ ...styles.paletteItem, borderColor: m.color + '44' }}
                >
                  <span style={styles.paletteIcon}>{m.icon}</span>
                  <div>
                    <div style={styles.paletteName}>{m.type}</div>
                    <div style={{ ...styles.paletteTag, color: m.color }}>{m.muscleGroup}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={styles.gridWrap}>
          <div
            ref={gridRef}
            style={{ ...styles.grid, gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL}px)`, gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL}px)` }}
          >
            {Array.from({ length: GRID_ROWS }).map((_, row) =>
              Array.from({ length: GRID_COLS }).map((_, col) => {
                const machine = getMachineAt(col, row);
                const isOver = dragOver && dragOver.col === col && dragOver.row === row;
                return (
                  <div
                    key={`${col}-${row}`}
                    style={{
                      ...styles.cell,
                      background: isOver ? 'rgba(230,57,70,0.15)' : 'transparent',
                      borderColor: isOver ? 'rgba(230,57,70,0.5)' : 'rgba(255,255,255,0.05)',
                    }}
                    onDragOver={e => { e.preventDefault(); setDragOver({ col, row }); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => handleDrop(e, col, row)}
                  >
                    {machine && (
                      <div
                        draggable
                        onDragStart={e => handleDragStartGrid(e, machine)}
                        onClick={() => {
                          setSelectedMachine(machine);
                          setLogModal(machine);
                        }}
                        title={machine.label}
                        style={{
                          ...styles.machineCell,
                          background: categoryColor(machine.category) + '22',
                          border: `2px solid ${categoryColor(machine.category)}`,
                          boxShadow: selectedMachine?.id === machine.id ? `0 0 12px ${categoryColor(machine.category)}` : 'none',
                        }}
                      >
                        <span style={styles.machineEmoji}>{machine.icon}</span>
                        <span style={styles.machineLabel}>{machine.label?.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right panel for selected */}
      {selectedMachine && !logModal && (
        <div style={styles.infoPanel}>
          <h3 style={styles.infoTitle}>{selectedMachine.icon} {selectedMachine.label}</h3>
          <p style={styles.infoSub}>{selectedMachine.muscleGroup} • {selectedMachine.category}</p>
          <button style={styles.logBtn} onClick={() => setLogModal(selectedMachine)}>Log Workout</button>
          <button style={styles.removeBtn} onClick={() => removeMachine(selectedMachine.id)}>Remove</button>
        </div>
      )}

      {logModal && (
        <WorkoutModal machine={logModal} onClose={() => { setLogModal(null); setSelectedMachine(null); }} />
      )}
    </div>
  );
}

const styles = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0a0a' },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
    flexWrap: 'wrap', gap: '8px',
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  addBtn: {
    background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '8px 16px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '14px',
    letterSpacing: '1px', cursor: 'pointer',
  },
  legend: { display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginLeft: '8px' },
  hint: { color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', margin: 0 },
  workspace: { flex: 1, display: 'flex', overflow: 'hidden' },
  sidebar: {
    width: '240px', background: '#111', borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
  },
  search: {
    margin: '12px', padding: '10px 14px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', outline: 'none',
  },
  palette: { flex: 1, overflowY: 'auto', padding: '0 12px 12px' },
  paletteItem: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
    background: '#1a1a1a', border: '1px solid', borderRadius: '8px', marginBottom: '6px',
    cursor: 'grab', userSelect: 'none', transition: 'opacity 0.2s',
  },
  paletteIcon: { fontSize: '20px', flexShrink: 0 },
  paletteName: { fontSize: '12px', color: '#fff', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 },
  paletteTag: { fontSize: '11px', fontFamily: '"DM Sans", sans-serif', marginTop: '2px' },
  gridWrap: { flex: 1, overflow: 'auto', padding: '20px' },
  grid: { display: 'grid', width: 'fit-content' },
  cell: {
    width: CELL, height: CELL, border: '1px solid', position: 'relative',
    transition: 'background 0.15s, border-color 0.15s',
  },
  machineCell: {
    position: 'absolute', inset: '2px', borderRadius: '8px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'box-shadow 0.2s', padding: '2px',
  },
  machineEmoji: { fontSize: '20px' },
  machineLabel: { fontSize: '8px', color: '#fff', fontFamily: '"DM Sans", sans-serif', textAlign: 'center', lineHeight: 1.2, marginTop: '2px' },
  infoPanel: {
    position: 'absolute', right: '20px', bottom: '80px', background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px',
  },
  infoTitle: { margin: 0, color: '#fff', fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '1px' },
  infoSub: { margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' },
  logBtn: {
    background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '10px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer',
  },
  removeBtn: {
    background: 'transparent', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', cursor: 'pointer',
  },
};
