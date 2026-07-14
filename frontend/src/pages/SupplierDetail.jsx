import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import EvaluationModal from '../components/EvaluationModal';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';

export default function SupplierDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const backLink = (location.state?.from || '/suppliers') + (location.state?.search ? `?${location.state.search}` : '');
  const backTitle = location.state?.title || 'Suppliers';

  const [supplier, setSupplier] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [expandedEvalId, setExpandedEvalId] = useState(null);

  const fetchSupplierData = async () => {
    try {
      const [supplierRes, evalRes] = await Promise.all([
        api.get(`/suppliers/${id}`),
        api.get(`/suppliers/${id}/evaluations`)
      ]);
      setSupplier(supplierRes.data);
      setEvaluations(evalRes.data?.data || evalRes.data || []);
    } catch (error) {
      console.error('Failed to fetch supplier details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierData();
  }, [id]);

  const toggleEvalExpanded = (evalId) => {
    if (expandedEvalId === evalId) {
      setExpandedEvalId(null);
    } else {
      setExpandedEvalId(evalId);
    }
  };

  const handleApprove = async (evalId) => {
    try {
      await api.post(`/evaluations/${evalId}/approve`);
      fetchSupplierData();
    } catch (error) {
      console.error('Failed to approve evaluation', error);
      alert('Failed to approve evaluation');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-body">Loading...</div>;
  }

  if (!supplier) {
    return <div className="p-8 text-center text-red-500 font-body">Supplier not found</div>;
  }

  // Calculate latest score if evaluations exist
  const currentScore = supplier.current_score;

  return (
    <div className="p-8 font-body max-w-6xl mx-auto">
      {/* Navigation & Breadcrumbs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <Link to={backLink} className="hover:text-teal transition-colors">{backTitle}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{supplier.name}</span>
        </div>
        
        <Link 
          to={backLink}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-navy transition-colors bg-white px-3 py-1.5 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to {backTitle}
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <ScoreRing score={currentScore} size="lg" />
            <div>
              <h1 className="text-3xl font-display font-semibold text-navy mb-1">{supplier.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-mono">{supplier.registration_number}</span>
                <span>•</span>
                <span>{supplier.category}</span>
                <span>•</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  supplier.status === 'active' ? 'bg-emerald/10 text-emerald' : 
                  supplier.status === 'pending' ? 'bg-amber/10 text-amber' : 
                  'bg-rust/10 text-rust'
                }`}>
                  {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {can(user, 'evaluations.create') && (
            <div className="flex space-x-3 w-full md:w-auto">
              <button 
                onClick={() => setShowEvalModal(true)}
                className="flex-1 md:flex-none bg-teal hover:bg-teal/90 text-white font-medium px-6 py-2.5 rounded-md shadow-sm transition-colors text-center"
              >
                New Evaluation
              </button>
            </div>
          )}
        </div>
        
        {/* Contact Info Strip */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:space-x-8 text-sm text-gray-600">
          {supplier.email && <div className="flex items-center space-x-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> <span>{supplier.email}</span></div>}
          {supplier.phone && <div className="flex items-center space-x-2 mt-2 sm:mt-0"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> <span>{supplier.phone}</span></div>}
          {supplier.address && <div className="flex items-center space-x-2 mt-2 sm:mt-0"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> <span>{supplier.address}</span></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Evaluations History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-display font-semibold text-navy">Evaluation History</h2>
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">{evaluations.length} total</span>
            </div>
            
            {evaluations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No evaluations recorded yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Period</th>
                    <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Score</th>
                    <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {evaluations.map(evaluation => (
                    <React.Fragment key={evaluation.id}>
                      <tr 
                        className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${expandedEvalId === evaluation.id ? 'bg-gray-50' : ''}`}
                        onClick={() => toggleEvalExpanded(evaluation.id)}
                      >
                        <td className="p-4 font-medium text-gray-900">{evaluation.period}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <ScoreRing score={Math.round(evaluation.total_score)} size="xs" />
                            <span className="font-semibold text-sm">{evaluation.total_score.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            evaluation.status === 'approved' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'
                          }`}>
                            {evaluation.status === 'submitted' ? 'Pending approval' : 'Approved'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {can(user, 'evaluations.approve') && evaluation.status === 'submitted' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApprove(evaluation.id); }}
                              className="mr-4 px-3 py-1 bg-teal hover:bg-teal/90 text-white text-xs font-medium rounded shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          <svg className={`inline-block w-5 h-5 text-gray-400 transform transition-transform ${expandedEvalId === evaluation.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </td>
                      </tr>
                      
                      {/* Expanded Details Row */}
                      {expandedEvalId === evaluation.id && (
                        <tr>
                          <td colSpan="4" className="bg-gray-50/50 p-6 border-b border-gray-200">
                            <div className="mb-4">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Score Breakdown</h4>
                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-2 font-medium text-gray-600">Criteria</th>
                                      <th className="px-4 py-2 font-medium text-gray-600 text-right">Raw Score</th>
                                      <th className="px-4 py-2 font-medium text-gray-600 text-right">Weight</th>
                                      <th className="px-4 py-2 font-medium text-gray-600 text-right">Weighted</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {evaluation.evaluation_scores?.map(score => (
                                      <tr key={score.id}>
                                        <td className="px-4 py-2 text-gray-800">{score.criteria?.name}</td>
                                        <td className="px-4 py-2 text-right text-gray-600">{score.raw_score}</td>
                                        <td className="px-4 py-2 text-right text-gray-500">{score.weight_used}</td>
                                        <td className="px-4 py-2 text-right font-medium text-navy">{score.weighted_score.toFixed(1)}</td>
                                      </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-semibold border-t-2 border-gray-200">
                                      <td colSpan="3" className="px-4 py-2 text-right text-gray-700">Total Score</td>
                                      <td className="px-4 py-2 text-right text-navy">{evaluation.total_score.toFixed(1)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            {evaluation.comments && (
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comments</h4>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg text-sm text-gray-700">
                                  {evaluation.comments}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contracts Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display font-semibold text-navy">Active Contracts</h3>
            </div>
            <div className="p-6">
              {supplier.contracts?.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No active contracts.</p>
              ) : (
                <ul className="space-y-4">
                  {supplier.contracts?.map(contract => (
                    <li key={contract.id} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium text-gray-800">Contract #{contract.id}</div>
                        <div className="text-gray-500 text-xs">{contract.start_date} to {contract.end_date}</div>
                      </div>
                      <span className="bg-emerald/10 text-emerald text-xs font-medium px-2 py-0.5 rounded">Active</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEvalModal && (
        <EvaluationModal 
          supplierId={id} 
          onClose={() => setShowEvalModal(false)} 
          onSuccess={fetchSupplierData} 
        />
      )}
    </div>
  );
}
