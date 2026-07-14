import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';
import ContractForm from './ContractForm';

export default function ContractDetailModal({ contractId, suppliers, onClose, onSuccess }) {
  const { user } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modes: 'view', 'edit', 'delete_confirm'
  const [mode, setMode] = useState('view');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/contracts/${contractId}`);
      setContract(res.data);
    } catch (err) {
      console.error('Failed to load contract details', err);
      setError('Failed to load contract details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [contractId]);

  const handleUpdate = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      await api.put(`/contracts/${contractId}`, formData);
      if (onSuccess) onSuccess();
      // Fetch fresh data and switch back to view mode
      await fetchDetail();
      setMode('view');
    } catch (err) {
      console.error('Failed to update contract', err);
      setError(err.response?.data?.message || 'Failed to update contract.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await api.delete(`/contracts/${contractId}`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to delete contract', err);
      setError(err.response?.data?.message || 'Failed to delete contract.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-display font-semibold text-navy">
            {mode === 'edit' ? 'Edit Contract' : 'Contract Details'}
          </h2>
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
          ) : contract ? (
            mode === 'edit' ? (
              <div className="bg-navy p-6 rounded-xl shadow-inner border border-gray-800 text-parchment">
                <ContractForm 
                  initialData={{
                    supplier_id: contract.supplier_id,
                    title: contract.title,
                    start_date: contract.start_date,
                    end_date: contract.end_date || '',
                    value: contract.value || '',
                    sla_terms: contract.sla_terms || ''
                  }}
                  suppliers={suppliers} 
                  onSubmit={handleUpdate} 
                  onCancel={() => setMode('view')} 
                  submitLabel={isSubmitting ? 'Saving...' : 'Save Changes'} 
                />
              </div>
            ) : mode === 'delete_confirm' ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rust/10 mb-4">
                  <svg className="h-6 w-6 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-navy">Delete Contract</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the contract <strong>{contract.title}</strong>? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setMode('view')}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-rust border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-navy mb-2">{contract.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                    <Link to={`/suppliers/${contract.supplier_id}`} className="font-medium text-teal hover:text-teal/80 transition-colors">
                      {contract.supplier?.name || `Supplier #${contract.supplier_id}`}
                    </Link>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      contract.status === 'active' ? 'bg-emerald/10 text-emerald' : 
                      contract.status === 'renewal_pending' ? 'bg-amber/10 text-amber' : 
                      contract.status === 'terminated' ? 'bg-rust/10 text-rust' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {contract.status === 'renewal_pending' ? 'Renewal Pending' : contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Start Date</span>
                    <span className="font-medium text-gray-900 font-mono">{contract.start_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">End Date</span>
                    <span className="font-medium text-gray-900 font-mono">{contract.end_date || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Value</span>
                    <span className="font-medium text-gray-900 font-mono">
                      {contract.value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(contract.value) : '—'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-2">SLA Terms</h4>
                  <div className="bg-white p-4 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap min-h-[100px]">
                    {contract.sla_terms || <span className="text-gray-400 italic">No SLA terms defined.</span>}
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>
        
        {mode === 'view' && contract && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <div>
              {can(user, 'contracts.delete') && (
                <button 
                  type="button" 
                  onClick={() => setMode('delete_confirm')} 
                  className="text-sm font-medium text-rust hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-rust/10"
                >
                  Delete Contract
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-colors"
              >
                Close
              </button>
              
              {can(user, 'contracts.update') && (
                <button 
                  type="button"
                  onClick={() => setMode('edit')}
                  className="px-4 py-2 text-sm font-medium text-navy bg-gold rounded-md hover:bg-gold/90 shadow-sm transition-colors flex items-center"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
