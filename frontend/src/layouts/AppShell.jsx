import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';

export default function AppShell() {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors border ${
      isActive
        ? 'bg-teal/20 text-gold border-teal/30'
        : 'hover:bg-gray-800 text-gray-300 border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-parchment flex font-body">
      {/* Sidebar - fixed width 170px per spec */}
      <aside className="w-[170px] bg-navy text-white flex flex-col shadow-lg shrink-0">
        <div className="p-4 border-b border-gray-800 flex justify-center">
          <Logo inverted={true} />
        </div>
        
        <nav className="flex-1 p-3 space-y-2 mt-2">
          {user?.role === 'admin' ? (
            <NavLink to="/admin-dashboard" className={navLinkClass}>
              <span className="font-medium text-sm">Dashboard</span>
            </NavLink>
          ) : user?.role === 'procurement_manager' ? (
            <NavLink to="/manager-dashboard" className={navLinkClass}>
              <span className="font-medium text-sm">Dashboard</span>
            </NavLink>
          ) : (
            <NavLink to="/dashboard" className={navLinkClass}>
              <span className="font-medium text-sm">Dashboard</span>
            </NavLink>
          )}
          <NavLink to="/suppliers" className={navLinkClass}>
            <span className="font-medium text-sm">Suppliers</span>
          </NavLink>
          <NavLink to="/contracts" className={navLinkClass}>
            <span className="font-medium text-sm">Contracts</span>
          </NavLink>
          <NavLink to="/evaluations" className={navLinkClass}>
            <span className="font-medium text-sm">Evaluations</span>
          </NavLink>
          <NavLink to="/rankings" className={navLinkClass}>
            <span className="font-medium text-sm">Rankings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
          <div className="truncate mb-2">{user?.name}</div>
          <button
            onClick={logout}
            className="w-full text-left text-rust hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
