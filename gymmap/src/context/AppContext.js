import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gymmap_users') || '{}'); } catch { return {}; }
  });
  const [floorPlan, setFloorPlan] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState({});
  const [activeLog, setActiveLog] = useState(null);

  useEffect(() => {
    localStorage.setItem('gymmap_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      const saved = users[user.email];
      setFloorPlan(saved?.floorPlan || []);
      setWorkoutLogs(saved?.workoutLogs || {});
    }
  }, [user]);

  const saveUserData = (fp, logs) => {
    setUsers(prev => ({
      ...prev,
      [user.email]: { ...prev[user.email], floorPlan: fp, workoutLogs: logs }
    }));
  };

  const updateFloorPlan = (newPlan) => {
    setFloorPlan(newPlan);
    saveUserData(newPlan, workoutLogs);
  };

  const logWorkout = (machineId, entry) => {
    const newLogs = {
      ...workoutLogs,
      [machineId]: [...(workoutLogs[machineId] || []), { ...entry, id: uuidv4(), date: new Date().toISOString() }]
    };
    setWorkoutLogs(newLogs);
    saveUserData(floorPlan, newLogs);
  };

  const getMachineLogs = (machineId) => workoutLogs[machineId] || [];

  const getLastLog = (machineId) => {
    const logs = getMachineLogs(machineId);
    return logs[logs.length - 1] || null;
  };

  const getRecommendation = (machine) => {
    const similar = floorPlan.filter(m =>
      m.id !== machine.id &&
      m.category === machine.category &&
      m.muscleGroup === machine.muscleGroup
    );
    if (!similar.length) return null;
    const logsWithData = similar
      .map(m => getLastLog(m.id))
      .filter(Boolean)
      .filter(l => l.weight);
    if (!logsWithData.length) return null;
    const avg = logsWithData.reduce((a, b) => a + Number(b.weight), 0) / logsWithData.length;
    return Math.round(avg / 5) * 5;
  };

  const signup = (name, email, password) => {
    if (users[email]) return { error: 'Email already registered' };
    const newUser = { name, email, id: uuidv4() };
    setUsers(prev => ({ ...prev, [email]: { ...newUser, password, floorPlan: [], workoutLogs: {} } }));
    setUser(newUser);
    setFloorPlan([]);
    setWorkoutLogs({});
    return { success: true };
  };

  const login = (email, password) => {
    const found = users[email];
    if (!found || found.password !== password) return { error: 'Invalid email or password' };
    setUser({ name: found.name, email: found.email, id: found.id });
    setFloorPlan(found.floorPlan || []);
    setWorkoutLogs(found.workoutLogs || {});
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setFloorPlan([]);
    setWorkoutLogs({});
    setActiveLog(null);
  };

  return (
    <AppContext.Provider value={{
      user, floorPlan, workoutLogs, activeLog,
      setActiveLog, updateFloorPlan, logWorkout,
      getMachineLogs, getLastLog, getRecommendation,
      signup, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
