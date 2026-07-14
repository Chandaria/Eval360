import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';
import ContractForm from '../components/ContractForm';
import ContractDetailModal from '../components/ContractDetailModal';

export default function Contracts() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);

  const fetchData = async () => {
    try {
      const [contractsRes, suppliersRes] = await Promise.all([
        api.get('/contracts'),
        api.get('/suppliers')
      ]);
      setContracts(contractsRes.data?.data || contractsRes.data || []);
      setSuppliers(suppliersRes.data?.data || suppliersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (formData) => {
    setApiError('');
    try {
      await api.post('/contracts', formData);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create contract', error);
      if (error.response?.status === 403) {
        setApiError('Forbidden — insufficient role');
      } else {
        setApiError('Failed to create contract. Please check your inputs.');
      }
    }
  };

  return (
    <div className="p-8 font-body">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-navy">Contracts</h1>
          <p className="text-gray-600 mt-2">Manage your supplier agreements and track expirations.</p>
        </div>
        {can(user, 'contracts.create') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gold hover:bg-gold/90 text-navy font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            {showForm ? 'Cancel' : 'New contract'}
          </button>
        )}
      </div>

      {apiError && (
        <div className="mb-4 p-4 bg-rust/10 border border-rust text-rust rounded-md">
          {apiError}
        </div>
      )}

      {showForm && (
        <div className="bg-navy p-6 rounded-xl shadow-lg mb-8 border border-gray-800 text-parchment">
          <h2 className="text-xl font-display font-semibold mb-4">New Contract</h2>
          <ContractForm 
            suppliers={suppliers} 
            onSubmit={handleCreate} 
            onCancel={() => setShowForm(false)} 
            submitLabel="Create Contract" 
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading contracts...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Contract</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Supplier</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">End Date</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map(contract => (
                <tr 
                  key={contract.id} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => { setSelectedContractId(contract.id); setShowDetailModal(true); }}
                >
                  <td className="p-4">
                    <div className="font-medium text-navy">{contract.title}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{contract.supplier?.name}</td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      contract.status === 'active' ? 'bg-emerald/10 text-emerald' : 
                      contract.status === 'renewal_pending' ? 'bg-amber/10 text-amber' : 
                      contract.status === 'terminated' ? 'bg-rust/10 text-rust' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {contract.status === 'renewal_pending' ? 'Renewal Pending' : contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-mono">
                    {contract.end_date || '—'}
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-mono text-right">
                    {contract.value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(contract.value) : '—'}
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No contracts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showDetailModal && selectedContractId && (
        <ContractDetailModal 
          contractId={selectedContractId}
          suppliers={suppliers}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedContractId(null);
          }}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
}
