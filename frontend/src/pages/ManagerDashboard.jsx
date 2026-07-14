import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import DashboardHeader from '../components/DashboardHeader';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    Promise.all([
      api.get('/dashboard/manager'),
      api.get('/evaluations/pending')
    ])
    .then(([dashboardRes, pendingRes]) => {
      setData(dashboardRes.data);
      setPendingEvaluations(pendingRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to load dashboard', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (evalId) => {
    try {
      await api.post(`/evaluations/${evalId}/approve`);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to approve evaluation', error);
      alert('Failed to approve evaluation');
    }
  };

  if (loading) return <div className="p-8 text-center text-teal-700">Loading Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-rose-600">Error loading data.</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 font-body">
      <DashboardHeader />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Pending Approvals</span>
          <span className="text-4xl font-mono text-navy">{pendingEvaluations.length}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Expiring Contracts</span>
          <span className="text-4xl font-mono text-rose-600">{data.expiring_contracts}</span>
          <span className="text-xs text-gray-400 mt-2">Within 60 days</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Total Suppliers</span>
          <span className="text-4xl font-mono text-navy">{data.total_suppliers}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area: Trend Chart & Approvals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display font-medium text-navy mb-6">6-Period Performance Trend</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--color-navy)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-gold)" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: 'var(--color-gold)' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-navy)' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Averages Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display font-medium text-navy mb-6">Average Score by Category</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.category_averages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-mono)' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--color-navy)', fontFamily: 'var(--font-body)' }}
                  />
                  <Bar dataKey="average_score" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display font-medium text-navy mb-6">Pending Approvals</h2>
            {pendingEvaluations.length === 0 ? (
              <p className="text-gray-500">No evaluations waiting for approval.</p>
            ) : (
              <div className="space-y-4">
                {pendingEvaluations.map(evaluation => (
                  <div key={evaluation.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-50 rounded-lg bg-gray-50/50">
                    <div>
                      <Link to={`/suppliers/${evaluation.supplier_id}`} className="font-medium text-navy hover:text-teal transition-colors">
                        {evaluation.supplier?.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        Period: <span className="font-medium text-gray-700">{evaluation.period}</span> • 
                        Score: <span className="font-medium text-gray-700">{Math.round(evaluation.total_score)}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Submitted by {evaluation.evaluator?.name} on {new Date(evaluation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApprove(evaluation.id)}
                      className="mt-3 sm:mt-0 px-4 py-2 bg-teal hover:bg-teal/90 text-white text-sm font-medium rounded shadow-sm transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top/Bottom Rankings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-display font-medium text-navy mb-4">Top Performers</h2>
          <div className="flex flex-col gap-4 mb-8">
            {data.top_suppliers.map(sup => (
              <div key={sup.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium text-navy">{sup.name}</h3>
                  <span className="text-xs text-gray-500">{sup.category}</span>
                </div>
                <ScoreRing score={sup.score} size={48} strokeWidth={4} />
              </div>
            ))}
          </div>

          <h2 className="text-xl font-display font-medium text-navy mb-4 pt-4 border-t border-gray-100">At-Risk Suppliers</h2>
          <div className="flex flex-col gap-4">
            {data.bottom_suppliers.slice(0, 3).map(sup => (
              <div key={sup.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium text-navy">{sup.name}</h3>
                  <span className="text-xs text-gray-500">{sup.category}</span>
                </div>
                <ScoreRing score={sup.score} size={48} strokeWidth={4} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
