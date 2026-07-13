import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_suppliers: 0,
    active_contracts: 0,
    average_score: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-navy">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of supplier performance and contracts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Card 1 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Suppliers</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loading ? '-' : stats.total_suppliers}
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Average Score</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loading ? '-' : (stats.average_score !== null ? stats.average_score : 'N/A')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Approved evaluations only</div>
        </div>

        {/* KPI Card 3 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Active Contracts</h3>
          <div className="text-4xl font-mono text-navy mt-auto font-medium">
            {loading ? '-' : stats.active_contracts}
          </div>
        </div>
      </div>
    </div>
  );
}
