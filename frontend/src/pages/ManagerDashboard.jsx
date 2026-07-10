import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/manager')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-teal-700">Loading Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-rose-600">Error loading data.</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 font-body">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-4xl font-display font-semibold text-navy">Manager Dashboard</h1>
        <p className="text-gray-500 mt-2">Oversight, approvals, and analytical trends.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Pending Approvals</span>
          <span className="text-4xl font-mono text-navy">{data.pending_evaluations}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Expiring Contracts</span>
          <span className="text-4xl font-mono text-rose-600">{data.expiring_contracts}</span>
          <span className="text-xs text-gray-400 mt-2">Within 60 days</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
          <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Total Suppliers</span>
          <span className="text-4xl font-mono text-navy">{data.top_suppliers.length + data.bottom_suppliers.length /* mock */}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
