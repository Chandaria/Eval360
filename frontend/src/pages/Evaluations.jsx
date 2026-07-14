import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';
import EvaluationDetailModal from '../components/EvaluationDetailModal';

export default function Evaluations() {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvalId, setSelectedEvalId] = useState(null);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      let url = '/evaluations?';
      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterSupplier) url += `supplier_id=${filterSupplier}&`;
      
      const res = await api.get(url);
      setEvaluations(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch evaluations', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch suppliers', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchEvaluations();
  }, [filterStatus, filterSupplier]);

  const handleApprove = async (evalId) => {
    try {
      await api.post(`/evaluations/${evalId}/approve`);
      fetchEvaluations();
    } catch (error) {
      console.error('Failed to approve evaluation', error);
      alert('Failed to approve evaluation');
    }
  };

  return (
    <div className="p-8 font-body max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-navy">Evaluations</h1>
          <p className="text-gray-600 mt-2">System-wide evaluation records and approvals.</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1 font-medium">Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded focus:ring-teal focus:border-teal text-gray-800 text-sm"
          >
            <option value="">All</option>
            <option value="submitted">Pending approval</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1 font-medium">Supplier</label>
          <select 
            value={filterSupplier} 
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded focus:ring-teal focus:border-teal text-gray-800 text-sm w-64"
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading evaluations...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Supplier</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Period</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Score</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Evaluator</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Approved By</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Submitted</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {evaluations.map(evaluation => (
                <tr 
                  key={evaluation.id} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => { setSelectedEvalId(evaluation.id); setShowDetailModal(true); }}
                >
                  <td className="p-4">
                    <Link 
                      to={`/suppliers/${evaluation.supplier_id}`} 
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-navy hover:text-teal transition-colors"
                    >
                      {evaluation.supplier?.name || `Supplier #${evaluation.supplier_id}`}
                    </Link>
                  </td>
                  <td className="p-4 font-medium text-gray-900">{evaluation.period}</td>
                  <td className="p-4">
                    {evaluation.total_score !== null && evaluation.total_score !== undefined ? (
                      <div className="flex items-center space-x-2">
                        <ScoreRing score={Math.round(evaluation.total_score)} size="xs" />
                        <span className="font-semibold text-sm">{Number(evaluation.total_score).toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      evaluation.status === 'approved' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'
                    }`}>
                      {evaluation.status === 'submitted' ? 'Pending approval' : 'Approved'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{evaluation.evaluator?.name || '—'}</td>
                  <td className="p-4 text-sm text-gray-600">{evaluation.approver?.name || '—'}</td>
                  <td className="p-4 text-sm text-gray-500 font-mono">
                    {new Date(evaluation.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    {can(user, 'evaluations.approve') && evaluation.status === 'submitted' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApprove(evaluation.id); }}
                        className="px-3 py-1 bg-teal hover:bg-teal/90 text-white text-xs font-medium rounded shadow-sm transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {evaluations.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">No evaluations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showDetailModal && selectedEvalId && (
        <EvaluationDetailModal 
          evaluationId={selectedEvalId} 
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvalId(null);
          }}
          onSuccess={() => fetchEvaluations()}
        />
      )}
    </div>
  );
}
