import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SiteDashboard from './pages/SiteDashboard';
import DeviceDetails from './pages/DeviceDetails';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/site/:siteId" element={
            <ProtectedRoute>
              <SiteDashboard />
            </ProtectedRoute>
          } />
          <Route path="/site/:siteId/device/:deviceId" element={
            <ProtectedRoute>
              <DeviceDetails />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

