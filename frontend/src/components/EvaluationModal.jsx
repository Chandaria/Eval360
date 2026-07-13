import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function EvaluationModal({ supplierId, onClose, onSuccess }) {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [period, setPeriod] = useState('');
  const [comments, setComments] = useState('');
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const res = await api.get('/evaluation-criteria');
        setCriteria(res.data);
        
        // Initialize scores object
        const initialScores = {};
        res.data.forEach(c => {
          initialScores[c.id] = '';
        });
        setScores(initialScores);
      } catch (error) {
        console.error('Failed to fetch criteria', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCriteria();
  }, []);

  const handleScoreChange = (id, value) => {
    setScores({ ...scores, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format scores array
    const formattedScores = Object.entries(scores).map(([criteria_id, raw_score]) => ({
      criteria_id: parseInt(criteria_id),
      raw_score: parseFloat(raw_score)
    }));

    try {
      await api.post(`/suppliers/${supplierId}/evaluations`, {
        period,
        comments,
        scores: formattedScores
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to submit evaluation', error);
      alert('Failed to submit evaluation. Please check your inputs.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-display font-semibold text-navy">New Evaluation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading criteria...</div>
          ) : (
            <form id="evaluation-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period (e.g. 2026-Q3)</label>
                  <input 
                    type="text" 
                    required 
                    value={period} 
                    onChange={e => setPeriod(e.target.value)} 
                    placeholder="2026-Q3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal focus:border-teal" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea 
                    value={comments} 
                    onChange={e => setComments(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal focus:border-teal" 
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">Performance Scores (0-100)</h3>
                <div className="space-y-4">
                  {criteria.map(c => (
                    <div key={c.id} className="flex justify-between items-center">
                      <div className="w-1/2 text-sm text-gray-700">{c.name} <span className="text-xs text-gray-400 ml-1">(Wt: {c.weight})</span></div>
                      <div className="w-1/3">
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          required 
                          value={scores[c.id]} 
                          onChange={e => handleScoreChange(c.id, e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal focus:border-teal text-right" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-colors">
            Cancel
          </button>
          <button type="submit" form="evaluation-form" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-teal rounded-md hover:bg-teal/90 shadow-sm transition-colors disabled:opacity-50">
            Submit Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}
