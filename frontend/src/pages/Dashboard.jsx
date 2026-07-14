import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import DashboardHeader from '../components/DashboardHeader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_suppliers: 0,
    active_contracts: 0,
    average_score: null
  });
  const [loading, setLoading] = useState(true);
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

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
    
    const fetchRecentEvaluations = async () => {
      try {
        const res = await api.get('/evaluations?limit=5');
        setRecentEvaluations(res.data);
      } catch (err) {
        console.error('Failed to fetch recent evaluations', err);
      } finally {
        setLoadingRecent(false);
      }
    };
    
    fetchStats();
    fetchRecentEvaluations();
  }, []);

  return (
    <div className="p-8">
      <DashboardHeader />

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

      {/* Recent Evaluations Widget */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-display font-semibold text-navy">Recent Evaluations</h3>
        </div>
        <div className="p-0">
          {loadingRecent ? (
            <div className="p-8 text-center text-gray-500">Loading recent evaluations...</div>
          ) : recentEvaluations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No evaluations found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentEvaluations.map(evalData => (
                <li key={evalData.id} className="p-4 hover:bg-gray-50/50 transition-colors flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <ScoreRing score={Math.round(evalData.total_score)} size="xs" />
                    <span className="font-medium text-navy">
                      {evalData.supplier?.name || `Supplier #${evalData.supplier_id}`}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    evalData.status === 'approved' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'
                  }`}>
                    {evalData.status === 'submitted' ? 'Pending' : 'Approved'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
