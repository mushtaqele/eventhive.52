
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabaseService } from '../services/supabaseService';
import type { Event } from '../types';
import OrganizerEventCard from '../components/OrganizerEventCard';
import Spinner from '../components/Spinner';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = useCallback(async () => {
    if (user?.role !== 'organizer') return;
    setLoading(true);
    try {
      const eventData = await supabaseService.getEventsByOrganizer(user.id);
      setMyEvents(eventData);
    } catch (error) {
      console.error("Error fetching organizer events:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  if (!user || user.role !== 'organizer') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-text-secondary mt-2">You must be an organizer to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-text-primary">My Events Dashboard</h2>
      {myEvents.length > 0 ? (
        <div className="space-y-6">
          {myEvents.map(event => (
            <OrganizerEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary">You haven't created any events yet.</p>
      )}
    </div>
  );
};

export default OrganizerDashboard;
