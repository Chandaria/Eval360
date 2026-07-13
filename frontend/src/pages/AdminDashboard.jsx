import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  
  const [stats, setStats] = useState({
    total_users: 0,
    total_suppliers: 0,
    total_contracts: 0,
    pending_evaluations: 0,
  });
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStats();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setMessage({ type: '', text: '' });
      await api.patch(`/users/${userId}`, { role: newRole });
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setMessage({ type: 'success', text: 'Role updated successfully.' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update role.' });
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gold/20 text-yellow-800 border-gold/30';
      case 'procurement_officer':
        return 'bg-teal/20 text-teal-800 border-teal/30';
      case 'procurement_manager':
        return 'bg-navy/10 text-navy border-navy/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRoleName = (role) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-semibold text-navy">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System-wide overview and user management.</p>
        </div>
      </header>

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

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-display font-semibold text-navy">Members</h2>
          {message.text && (
            <span className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-teal-600'}`}>
              {message.text}
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500 font-medium">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loadingUsers ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4">
                      {u.id === currentUser?.id ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleStyle(u.role)}`}>
                          {formatRoleName(u.role)}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal ${getRoleStyle(u.role)}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="procurement_manager">Procurement Manager</option>
                          <option value="procurement_officer">Procurement Officer</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
