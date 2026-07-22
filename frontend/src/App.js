import React, { useState, useEffect } from 'react';
import Dashboard from './screens/Dashboard';
import CreateProfile from './screens/CreateProfile';
import ReportSituation from './screens/ReportSituation';
import ViewResponse from './screens/ViewResponse';
import History from './screens/History';
import Login from './screens/Login';
import Landing from './screens/Landing';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('landing');
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
        setScreen('dashboard');
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
    setScreen('landing');
  };

  // Show landing page for new visitors
  if (screen === 'landing') {
    return <Landing navigate={navigate} />;
  }

  // Show login screen if not logged in
  if (!caregiver && screen === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#0a9c85"/>
            <path d="M15 9H12.5C9.5 9 7.5 11.5 7.5 16C7.5 20.5 9.5 23 12.5 23H15V9Z" fill="white" opacity="0.93"/>
            <path d="M17 9H19.5C22.5 9 24.5 11.5 24.5 16C24.5 20.5 22.5 23 19.5 23H17V9Z" fill="white" opacity="0.93"/>
            <rect x="14.5" y="23" width="3" height="2.5" rx="1.2" fill="white" opacity="0.7"/>
          </svg>
          <span className="logo-text">NeuroVero</span>
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
