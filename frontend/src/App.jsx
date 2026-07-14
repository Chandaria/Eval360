import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './layouts/AppShell';
import Login from './pages/Login';
import DashboardWrapper from './pages/DashboardWrapper';
import Suppliers from './pages/Suppliers';
import SupplierDetail from './pages/SupplierDetail';
import Contracts from './pages/Contracts';
import Evaluations from './pages/Evaluations';
import Rankings from './pages/Rankings';
import Users from './pages/Users';
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
            <Route path="/dashboard" element={<DashboardWrapper />} />
            
            {/* Redirect old dashboard routes to the consolidated dashboard */}
            <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/manager-dashboard" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/users" element={
              <RoleProtectedRoute permission="dashboard.admin">
                <Users />
              </RoleProtectedRoute>
            } />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/:id" element={<SupplierDetail />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
