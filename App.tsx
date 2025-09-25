
import React, { useState, useMemo } from 'react';
import { ClerkUser } from './types';
import type { Page } from './types';
import { AuthContext } from './contexts/AuthContext';
import { MOCK_USERS } from './services/clerkService';
import Header from './components/Header';
import EventCatalog from './pages/EventCatalog';
import OrganizerDashboard from './pages/OrganizerDashboard';
import MyTickets from './pages/MyTickets';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<ClerkUser | null>(null);
  const [page, setPage] = useState<Page>('catalog');

  const authContextValue = useMemo(() => ({
    user: currentUser,
    signIn: (userId: string) => {
      const user = MOCK_USERS.find(u => u.id === userId) || null;
      setCurrentUser(user);
      if (user?.role === 'organizer') {
        setPage('dashboard');
      } else {
        setPage('catalog');
      }
    },
    signOut: () => {
      setCurrentUser(null);
      setPage('catalog');
    },
  }), [currentUser]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <OrganizerDashboard />;
      case 'my-tickets':
        return <MyTickets />;
      case 'catalog':
      default:
        return <EventCatalog />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen bg-background font-sans">
        <Header setPage={setPage} currentPage={page} />
        <main className="container mx-auto px-4 py-8">
          {renderPage()}
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
