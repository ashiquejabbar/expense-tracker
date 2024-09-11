// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GuestGuard from './guards/GuestGuard';
import AuthGuard from './guards/AuthGuard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;