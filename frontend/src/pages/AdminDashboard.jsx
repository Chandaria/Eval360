import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/DashboardHeader';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  
  const [stats, setStats] = useState({
    total_users: 0,
    total_suppliers: 0,
    total_contracts: 0,
    pending_evaluations: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="p-8">
      <DashboardHeader />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Users</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loadingStats ? '-' : stats.total_users}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Suppliers</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loadingStats ? '-' : stats.total_suppliers}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Contracts</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loadingStats ? '-' : stats.total_contracts}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Pending Evaluations</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loadingStats ? '-' : stats.pending_evaluations}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Users by Role Donut Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-display font-medium text-navy mb-6">Users by Role</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.users_by_role || []}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {(stats.users_by_role || []).map((entry, index) => {
                    let fill = '#94a3b8'; // Default
                    if (entry.role === 'admin') fill = 'var(--color-navy)';
                    else if (entry.role === 'procurement_officer') fill = 'var(--color-gold)';
                    else if (entry.role === 'procurement_manager') fill = 'var(--color-teal)';
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Users']}
                  labelFormatter={(role) => (role ? String(role).replace('_', ' ') : '')}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-mono)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: '12px' }} formatter={(value) => String(value).replace('_', ' ')} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evaluations Breakdown Donut Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-display font-medium text-navy mb-6">Evaluation Status</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.evaluations_by_status || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {(stats.evaluations_by_status || []).map((entry, index) => {
                    let fill = '#94a3b8'; // Default
                    if (entry.status === 'submitted') fill = 'var(--color-amber)';
                    else if (entry.status === 'approved') fill = 'var(--color-emerald)';
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Evaluations']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-mono)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: '12px' }} formatter={(value) => String(value).charAt(0).toUpperCase() + String(value).slice(1)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
