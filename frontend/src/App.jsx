import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './layouts/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Suppliers from './pages/Suppliers';
import SupplierDetail from './pages/SupplierDetail';
import Contracts from './pages/Contracts';
import { can } from './utils/permissions';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-parchment flex items-center justify-center text-navy font-body">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-parchment flex items-center justify-center text-navy font-body">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function RoleProtectedRoute({ permission, children }) {
  const { user } = useAuth();
  
  if (!can(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/manager-dashboard" 
              element={
                <RoleProtectedRoute permission="dashboard.manager">
                  <ManagerDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <RoleProtectedRoute permission="dashboard.admin">
                  <AdminDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/:id" element={<SupplierDetail />} />
            <Route path="/contracts" element={<Contracts />} />
            {/* Placeholders for future pages */}
            <Route path="/evaluations" element={<div className="p-8 font-body">Evaluations Page Placeholder</div>} />
            <Route path="/rankings" element={<div className="p-8 font-body">Rankings Page Placeholder</div>} />
            {/* Catch-all redirect for unmatched routes (e.g., old /dashboard/manager) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
