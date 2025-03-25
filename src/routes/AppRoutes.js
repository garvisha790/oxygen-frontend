import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SiteDashboard from "../pages/SiteDashboard";
import ManipalDashboard from "../pages/ManipalDashboard";
import ApolloDashboard from "../pages/ApolloDashboard";
import AsterDashboard from "../pages/AsterDashboard";
import BioconDashboard from "../pages/BioconDashboard";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/site/:siteName"
          element={
            <PrivateRoute>
              <SiteDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manipal"
          element={
            <PrivateRoute>
              <ManipalDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/apollo"
          element={
            <PrivateRoute>
              <ApolloDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/aster"
          element={
            <PrivateRoute>
              <AsterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/biocon"
          element={
            <PrivateRoute>
              <BioconDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;