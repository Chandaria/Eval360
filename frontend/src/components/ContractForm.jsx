import React, { useState } from 'react';

export default function ContractForm({ initialData, suppliers, onSubmit, onCancel, submitLabel = "Save Contract" }) {
  const [formData, setFormData] = useState(initialData || {
    supplier_id: '',
    title: '',
    start_date: '',
    end_date: '',
    value: '',
    sla_terms: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-inherit opacity-80">Supplier</label>
        <select name="supplier_id" required value={formData.supplier_id} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:ring-gold focus:border-gold outline-none">
          <option value="" className="text-gray-900">Select a supplier...</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-inherit opacity-80">Title</label>
        <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:ring-gold focus:border-gold outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-inherit opacity-80">Start Date</label>
        <input type="date" name="start_date" required value={formData.start_date} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:ring-gold focus:border-gold outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-inherit opacity-80">End Date</label>
        <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:ring-gold focus:border-gold outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-inherit opacity-80">Value ($)</label>
        <input type="number" step="0.01" min="0" name="value" value={formData.value || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:ring-gold focus:border-gold outline-none" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1 text-inherit opacity-80">SLA Terms</label>
        <textarea name="sla_terms" value={formData.sla_terms || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded focus:ring-gold focus:border-gold outline-none" rows="3"></textarea>
      </div>
      <div className="md:col-span-2 flex justify-end mt-2 space-x-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 font-medium bg-transparent border border-white/30 rounded hover:bg-white/10 transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" className="bg-gold hover:bg-gold/90 text-navy font-medium px-6 py-2 rounded shadow transition-colors">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
