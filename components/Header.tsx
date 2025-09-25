
import React from 'react';
import type { Page } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_USERS } from '../services/clerkService';
import { TicketIcon } from './icons/TicketIcon';

interface HeaderProps {
  setPage: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ setPage, currentPage }) => {
  const { user, signIn, signOut } = useAuth();

  const NavLink: React.FC<{ pageName: Page; children: React.ReactNode }> = ({ pageName, children }) => {
    const isActive = currentPage === pageName;
    return (
      <button
        onClick={() => setPage(pageName)}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:bg-secondary hover:text-white'
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <TicketIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-text-primary">EventHive</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink pageName="catalog">Events</NavLink>
            {user && <NavLink pageName="my-tickets">My Tickets</NavLink>}
            {user?.role === 'organizer' && <NavLink pageName="dashboard">Dashboard</NavLink>}
          </nav>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span className="text-text-secondary text-sm">Welcome, {user.name}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <select 
                onChange={(e) => e.target.value && signIn(e.target.value)}
                className="bg-secondary text-text-primary border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Sign In As...</option>
                {MOCK_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
