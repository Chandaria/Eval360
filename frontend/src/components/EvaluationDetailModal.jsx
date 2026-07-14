import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';

export default function EvaluationDetailModal({ evaluationId, onClose, onSuccess }) {
  const { user } = useAuth();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/evaluations/${evaluationId}`);
        setEvaluation(res.data);
      } catch (err) {
        console.error('Failed to load evaluation details', err);
        setError('Failed to load evaluation details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [evaluationId]);

  const handleApprove = async () => {
    setError('');
    setApproving(true);
    try {
      await api.post(`/evaluations/${evaluationId}/approve`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to approve evaluation', err);
      // Do not close the modal, show inline error
      setError(err.response?.data?.message || 'Failed to approve evaluation. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-display font-semibold text-navy">Evaluation Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-rust/10 border border-rust text-rust rounded-md text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading details...</div>
          ) : evaluation ? (
            <div className="space-y-8">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-navy mb-2">
                    <Link to={`/suppliers/${evaluation.supplier_id}`} className="hover:text-teal transition-colors">
                      {evaluation.supplier?.name || `Supplier #${evaluation.supplier_id}`}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="font-medium bg-gray-100 px-2 py-1 rounded">Period: {evaluation.period}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded font-medium ${
                      evaluation.status === 'approved' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'
                    }`}>
                      {evaluation.status === 'submitted' ? 'Pending approval' : 'Approved'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <ScoreRing score={Math.round(evaluation.total_score)} size="lg" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Score</div>
                    <div className="text-3xl font-semibold text-navy">
                      {Number(evaluation.total_score).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <span className="text-gray-500 block mb-1">Evaluator</span>
                  <span className="font-medium text-gray-900">{evaluation.evaluator?.name || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Submitted Date</span>
                  <span className="font-medium text-gray-900 font-mono">{new Date(evaluation.created_at).toLocaleDateString()}</span>
                </div>
                {evaluation.status === 'approved' && (
                  <>
                    <div>
                      <span className="text-gray-500 block mb-1">Approved By</span>
                      <span className="font-medium text-gray-900">{evaluation.approver?.name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Approved Date</span>
                      <span className="font-medium text-gray-900 font-mono">{new Date(evaluation.approved_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Criteria Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">Score Breakdown</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Criterion</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">Raw Score</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">Weight</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">Weighted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {evaluation.evaluation_scores?.map(score => (
                        <tr key={score.id}>
                          <td className="px-4 py-3 text-gray-800">{score.criteria?.name || `Criteria #${score.criteria_id}`}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{score.raw_score}</td>
                          <td className="px-4 py-3 text-right text-gray-500">{score.weight_used}</td>
                          <td className="px-4 py-3 text-right font-medium text-navy">{Number(score.weighted_score).toFixed(1)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold border-t-2 border-gray-200">
                        <td colSpan="3" className="px-4 py-3 text-right text-gray-700">Total</td>
                        <td className="px-4 py-3 text-right text-navy">{Number(evaluation.total_score).toFixed(1)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comments */}
              {evaluation.comments && (
                <div>
                  <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-2">Comments</h4>
                  <div className="bg-white p-4 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                    {evaluation.comments}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-colors"
          >
            Close
          </button>
          
          {evaluation && can(user, 'evaluations.approve') && evaluation.status === 'submitted' && (
            <button 
              type="button"
              onClick={handleApprove}
              disabled={approving || loading} 
              className="px-4 py-2 text-sm font-medium text-white bg-teal rounded-md hover:bg-teal/90 shadow-sm transition-colors disabled:opacity-50 flex items-center"
            >
              {approving ? 'Approving...' : 'Approve Evaluation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
