import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DashboardHeader() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'procurement_manager') {
      api.get('/evaluations/pending')
        .then(res => setPendingCount(res.data.length))
        .catch(err => console.error(err));
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'There';

  const renderSubtext = () => {
    if (user?.role === 'admin') {
      return "System operations are normal. You have full administrative oversight.";
    }
    if (user?.role === 'procurement_manager') {
      if (pendingCount > 0) {
        return (
          <>
            You have <strong className="text-navy">{pendingCount} evaluations</strong> waiting for your review and approval.
          </>
        );
      }
      return "Your approval queue is completely cleared. Great job!";
    }
    return "Ready to log new vendor evaluations and track active SLAs today?";
  };

  return (
    <header className="mb-8 border-b border-gray-200 pb-4">
      <h1 className="font-display text-3xl font-semibold text-navy">
        {getGreeting()}, {firstName} 👋
      </h1>
      <p className="text-gray-600 text-sm mt-1">
        {renderSubtext()}
      </p>
    </header>
  );
}
