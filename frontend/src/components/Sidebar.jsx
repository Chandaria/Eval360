import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'procurement_manager') {
      api.get('/evaluations/pending')
        .then(res => setPendingCount(res.data.length))
        .catch(err => console.error(err));
    }
  }, [user]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors border ${
      isActive
        ? 'bg-teal/20 text-gold border-teal/30'
        : 'hover:bg-gray-800 text-gray-300 border-transparent'
    }`;

  const getNavItems = () => {
    switch(user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Users', path: '/users' },
          { name: 'Suppliers', path: '/suppliers' },
          { name: 'Contracts', path: '/contracts' },
          { name: 'All Reviews', path: '/evaluations' },
          { name: 'Rankings', path: '/rankings' },
        ];
      case 'procurement_manager':
        return [
          { name: 'Overview', path: '/dashboard' },
          { name: 'Approvals', path: '/evaluations', badge: true },
          { name: 'Suppliers', path: '/suppliers' },
          { name: 'Contracts', path: '/contracts' },
          { name: 'Rankings', path: '/rankings' },
        ];
      case 'procurement_officer':
      default:
        return [
          { name: 'Home', path: '/dashboard' },
          { name: 'Suppliers', path: '/suppliers' },
          { name: 'Contracts', path: '/contracts' },
          { name: 'My Reviews', path: '/evaluations' },
          { name: 'Rankings', path: '/rankings' },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-[170px] bg-navy text-white flex flex-col shadow-lg shrink-0">
      <div className="p-4 border-b border-gray-800 flex justify-center">
        <Logo inverted={true} />
      </div>
      
      <nav className="flex-1 p-3 space-y-2 mt-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => {
              if (item.path === '/suppliers') {
                 return navLinkClass({ isActive: isActive && location.state?.from !== '/rankings' });
              }
              if (item.path === '/rankings') {
                 return navLinkClass({ isActive: isActive || (location.pathname.startsWith('/suppliers/') && location.state?.from === '/rankings') });
              }
              return navLinkClass({ isActive });
            }}
          >
            <div className="flex-1 flex items-center justify-between w-full">
              <span className="font-medium text-sm">{item.name}</span>
              {item.badge && pendingCount > 0 && (
                <span className="bg-gold/20 text-gold font-mono font-bold px-2 py-0.5 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 flex flex-col space-y-3">
        <div className="text-sm font-medium text-gray-300 truncate text-center" title={user?.name}>
          {user?.name}
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-rust text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700 hover:border-rust shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
