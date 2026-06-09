import React, { useState, useEffect } from 'react';
import Dashboard from './screens/Dashboard';
import CreateProfile from './screens/CreateProfile';
import ReportSituation from './screens/ReportSituation';
import ViewResponse from './screens/ViewResponse';
import History from './screens/History';
import Login from './screens/Login';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [caregiver, setCaregiver] = useState(null);

  // On app load, check if the user is already logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('ng_token');
    const saved = localStorage.getItem('ng_caregiver');
    if (token && saved) {
      try {
        setCaregiver(JSON.parse(saved));
      } catch (e) {
        // Corrupted data — clear it
        localStorage.removeItem('ng_token');
        localStorage.removeItem('ng_caregiver');
      }
    }
  }, []);

  const navigate = (s) => setScreen(s);

  const handleLogin = (caregiverData, token) => {
    setCaregiver(caregiverData);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('ng_token');
    localStorage.removeItem('ng_caregiver');
    setCaregiver(null);
    setSelectedUser(null);
    setScreen('login');
  };

  // Show login screen if not logged in
  // (users can still skip login — Login.js has a "continue without account" link)
  if (!caregiver && screen !== 'dashboard') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-mark">N</span>
          <span className="logo-text">NeuroGrow</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selectedUser && (
            <div className="active-user">
              <span className="active-dot" />
              <span>{selectedUser.name}</span>
            </div>
          )}
          {caregiver ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#9ca3af', padding: '4px 8px',
                borderRadius: 6
              }}
              title={`Signed in as ${caregiver.email}`}
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => setScreen('login')}
              style={{
                background: 'none', border: '1px solid #374151', cursor: 'pointer',
                fontSize: 12, color: '#9ca3af', padding: '4px 8px',
                borderRadius: 6
              }}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {screen === 'login' && (
          <Login onLogin={handleLogin} />
        )}
        {screen === 'dashboard' && (
          <Dashboard
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            navigate={navigate}
          />
        )}
        {screen === 'create-profile' && (
          <CreateProfile
            navigate={navigate}
            setSelectedUser={setSelectedUser}
          />
        )}
        {screen === 'edit-profile' && (
          <CreateProfile
            navigate={navigate}
            setSelectedUser={setSelectedUser}
            editUser={selectedUser}
          />
        )}
        {screen === 'report' && (
          <ReportSituation
            selectedUser={selectedUser}
            navigate={navigate}
            setLastResponse={setLastResponse}
          />
        )}
        {screen === 'response' && (
          <ViewResponse
            response={lastResponse}
            selectedUser={selectedUser}
            navigate={navigate}
          />
        )}
        {screen === 'history' && (
          <History
            selectedUser={selectedUser}
            navigate={navigate}
          />
        )}
      </main>
    </div>
  );
}
