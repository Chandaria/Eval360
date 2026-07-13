import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';

export default function Suppliers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    category: '',
    status: 'pending',
    email: '',
    phone: '',
    address: ''
  });

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch suppliers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    try {
      await api.post('/suppliers', formData);
      setShowForm(false);
      setFormData({
        name: '',
        registration_number: '',
        category: '',
        status: 'pending',
        email: '',
        phone: '',
        address: ''
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Failed to create supplier', error);
      if (error.response?.status === 403) {
        setApiError('Forbidden — insufficient role');
      } else {
        setApiError('An error occurred while creating the supplier.');
      }
    }
  };

  return (
    <div className="p-8 font-body">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-navy">Suppliers</h1>
          <p className="text-gray-600 mt-2">Manage your vendor relationships and track their status.</p>
        </div>
        {can(user, 'suppliers.create') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gold hover:bg-gold/90 text-navy font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            {showForm ? 'Cancel' : 'Add supplier'}
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
          <h2 className="text-xl font-display font-semibold mb-4">New Supplier</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Company Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Registration Number</label>
              <input type="text" name="registration_number" required value={formData.registration_number} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Category</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="blacklisted">Blacklisted</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-gold focus:border-gold text-white" rows="2"></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="bg-gold hover:bg-gold/90 text-navy font-medium px-6 py-2 rounded shadow transition-colors">
                Save Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading suppliers...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Supplier</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Category</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map(supplier => (
                <tr 
                  key={supplier.id} 
                  onClick={() => navigate(`/suppliers/${supplier.id}`)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <ScoreRing score={supplier.current_score} size="sm" />
                      <div>
                        <div className="font-medium text-navy">{supplier.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{supplier.registration_number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{supplier.category}</td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      supplier.status === 'active' ? 'bg-emerald/10 text-emerald' : 
                      supplier.status === 'pending' ? 'bg-amber/10 text-amber' : 
                      'bg-rust/10 text-rust'
                    }`}>
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div>{supplier.email}</div>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
