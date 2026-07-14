import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';

export default function Rankings() {
  const [data, setData] = useState({ champions: [], leaderboard: { data: [], current_page: 1, last_page: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Use search params for filters to preserve state when navigating back
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const periodFilter = searchParams.get('period') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  const setCategoryFilter = (val) => {
    setSearchParams(prev => { if (val) prev.set('category', val); else prev.delete('category'); prev.set('page', '1'); return prev; }, { replace: true });
  };
  const setPeriodFilter = (val) => {
    setSearchParams(prev => { if (val) prev.set('period', val); else prev.delete('period'); prev.set('page', '1'); return prev; }, { replace: true });
  };
  const setPage = (updater) => {
    setSearchParams(prev => { 
      const newPage = typeof updater === 'function' ? updater(page) : updater;
      prev.set('page', newPage); 
      return prev; 
    }, { replace: true });
  };

  // Hardcoded categories based on existing seed data (or could be fetched dynamically)
  const categories = ['Logistics', 'Raw Materials', 'IT Services', 'Office Supplies'];
  const periods = ['2026-Q4', '2026-Q3', '2026-Q2', '2026-Q1', '2025-Q4', '2025-Q3'];

  const fetchRankings = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/rankings?page=${page}`;
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;
      if (periodFilter) url += `&period=${encodeURIComponent(periodFilter)}`;

      const res = await api.get(url);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load rankings', err);
      setError('Unable to load leaderboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [categoryFilter, periodFilter, page]);

  const resetFilters = () => {
    setSearchParams({});
  };

  const renderTrend = (delta) => {
    if (delta > 0) {
      return (
        <div className="flex items-center text-emerald font-medium bg-emerald/10 px-2 py-1 rounded text-xs">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          +{delta}
        </div>
      );
    }
    if (delta < 0) {
      return (
        <div className="flex items-center text-rust font-medium bg-rust/10 px-2 py-1 rounded text-xs">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          {delta}
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-400 font-medium px-2 py-1 text-xs">
        <span className="text-lg leading-none mr-1">-</span> 0
      </div>
    );
  };

  const getRankBadge = (index) => {
    const rank = ((page - 1) * 20) + index + 1;
    if (rank === 1) {
      return <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/15 text-gold font-bold text-sm shadow-sm">1</div>;
    }
    if (rank === 2) {
      return <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 font-bold text-sm bg-gray-50">2</div>;
    }
    if (rank === 3) {
      return <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rust/15 text-rust font-bold text-sm shadow-sm">3</div>;
    }
    return <div className="inline-flex items-center justify-center w-8 h-8 text-gray-400 font-mono font-semibold text-sm">{rank}</div>;
  };

  return (
    <div className="p-8 font-body max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-navy">Rankings & Leaderboard</h1>
        <p className="text-gray-600 mt-2">Discover top-performing suppliers based on approved evaluations.</p>
      </div>

      {error && (
        <div className="p-4 bg-rust/10 border border-rust text-rust rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Top Section: Category Champions */}
      {!loading && data.champions && data.champions.length > 0 && !categoryFilter && (
        <div>
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Category Champions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.champions.map((champion) => (
              <Link key={`champ-${champion.id}`} to={`/suppliers/${champion.id}`} state={{ from: '/rankings', search: searchParams.toString(), title: 'Rankings' }} className="block group">
                <div className="bg-white rounded-xl shadow-sm border-t-4 border-gold p-5 hover:shadow-md transition-shadow relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gold/5 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10 mb-4">
                    <div className="text-xs font-semibold text-teal tracking-wider uppercase mb-1">{champion.category}</div>
                    <div className="font-display text-lg font-semibold text-navy truncate" title={champion.name}>{champion.name}</div>
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Latest Score</span>
                    <ScoreRing score={champion.computed_score} size="sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Middle Section: Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-teal focus:border-teal text-navy text-sm font-medium outline-none min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Evaluation Period</label>
          <select 
            value={periodFilter} 
            onChange={(e) => { setPeriodFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-teal focus:border-teal text-navy text-sm font-medium outline-none min-w-[200px]"
          >
            <option value="">Latest Available</option>
            {periods.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {(categoryFilter !== '' || periodFilter !== '') && (
          <button 
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-rust hover:text-red-700 bg-rust/5 hover:bg-rust/10 rounded-lg transition-colors border border-transparent"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Bottom Section: Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-gold rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Computing rankings...</p>
          </div>
        ) : data.leaderboard?.data?.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No suppliers found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 w-20 text-center font-medium text-gray-500 text-xs uppercase tracking-wider">Rank</th>
                  <th className="p-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="p-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Category</th>
                  <th className="p-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Trend</th>
                  <th className="p-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Score</th>
                  <th className="p-4 text-right font-medium text-gray-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.leaderboard.data.map((supplier, index) => (
                  <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center">
                      {getRankBadge(index)}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-navy group-hover:text-teal transition-colors">
                        {supplier.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {supplier.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {renderTrend(supplier.trend_delta)}
                    </td>
                    <td className="p-4">
                      <ScoreRing score={supplier.computed_score} size="sm" />
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/suppliers/${supplier.id}`}
                        state={{ from: '/rankings', search: searchParams.toString(), title: 'Rankings' }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-navy bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
                      >
                        Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && data.leaderboard && data.leaderboard.last_page > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {data.leaderboard.current_page} of {data.leaderboard.last_page}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={data.leaderboard.current_page === 1}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.leaderboard.last_page, p + 1))}
                disabled={data.leaderboard.current_page === data.leaderboard.last_page}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
