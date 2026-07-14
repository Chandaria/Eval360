import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import Dashboard from './Dashboard';

export default function DashboardWrapper() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 font-body text-gray-500">Loading dashboard...</div>;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'procurement_manager') {
    return <ManagerDashboard />;
  }
  
  return <Dashboard />;
}
