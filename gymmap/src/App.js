import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import FloorPlanPage from './pages/FloorPlanPage';
import HistoryPage from './pages/HistoryPage';
import NavBar from './components/NavBar';
import './App.css';

function AppInner() {
  const { user } = useApp();
  const [page, setPage] = useState('floor');

  if (!user) return <AuthPage />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <NavBar page={page} setPage={setPage} />
      {page === 'floor' && <FloorPlanPage />}
      {page === 'history' && <HistoryPage />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
