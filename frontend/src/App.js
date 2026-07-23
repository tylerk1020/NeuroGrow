import React, { useState, useEffect } from 'react';
import Dashboard from './screens/Dashboard';
import CreateProfile from './screens/CreateProfile';
import ReportSituation from './screens/ReportSituation';
import ViewResponse from './screens/ViewResponse';
import History from './screens/History';
import Login from './screens/Login';
import Landing from './screens/Landing';
import Manifesto from './screens/Manifesto';
import BrainLogo from './components/BrainLogo';
import API from './config';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [caregiver, setCaregiver] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  // On app load: handle ?verify=TOKEN from email link, then check existing session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get('verify');
    const pwResetToken = params.get('reset');

    if (pwResetToken) {
      window.history.replaceState({}, '', '/');
      setResetToken(pwResetToken);
      setScreen('login');
      return;
    }

    if (verifyToken) {
      // Clean the URL so the token doesn't sit in the address bar
      window.history.replaceState({}, '', '/');
      setScreen('verifying');
      fetch(`${API}/auth/verify-email?token=${verifyToken}`)
        .then(r => r.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('ng_token', data.access_token);
            localStorage.setItem('ng_caregiver', JSON.stringify(data.caregiver));
            setCaregiver(data.caregiver);
            setScreen('dashboard');
          } else {
            // Token invalid — go to landing and let them try logging in
            setScreen('landing');
          }
        })
        .catch(() => setScreen('landing'));
      return;
    }

    // No verify token — check if already logged in
    const token = localStorage.getItem('ng_token');
    const saved = localStorage.getItem('ng_caregiver');
    if (token && saved) {
      try {
        setCaregiver(JSON.parse(saved));
        setScreen('dashboard');
      } catch (e) {
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

  // Email verification in progress (arrived via ?verify=TOKEN link)
  if (screen === 'verifying') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#07091a', gap: 16,
      }}>
        <BrainLogo size={40} color="white" />
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'Inter, sans-serif' }}>
          Verifying your email…
        </div>
      </div>
    );
  }

  // Show landing page for new visitors
  if (screen === 'landing') {
    return <Landing navigate={navigate} />;
  }

  // Public manifesto page
  if (screen === 'manifesto') {
    return <Manifesto navigate={navigate} />;
  }

  // Show login screen if not logged in
  if (!caregiver && screen === 'login') {
    return <Login onLogin={handleLogin} resetToken={resetToken} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
          <BrainLogo size={32} color="white" />
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
