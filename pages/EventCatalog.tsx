
import React, { useState, useEffect, useCallback } from 'react';
import type { Event, Ticket } from '../types';
import { useAuth } from '../hooks/useAuth';
import { supabaseService } from '../services/supabaseService';
import EventCard from '../components/EventCard';
import TicketModal from '../components/TicketModal';
import Spinner from '../components/Spinner';

const EventCatalog: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<{ ticket: Ticket; event: Event } | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventData = await supabaseService.getEvents();
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTickets = useCallback(async () => {
    if (user) {
      const userTickets = await supabaseService.getTicketsByUser(user.id);
      setMyTickets(userTickets);
    } else {
      setMyTickets([]);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  const handleBookTicket = async (event: Event) => {
    if (!user) return;
    setBookingInProgress(event.id);
    try {
      const newTicket = await supabaseService.bookTicket(event.id, user.id);
      setMyTickets(prev => [...prev, newTicket]);
      setSelectedTicket({ ticket: newTicket, event });
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert((error as Error).message);
    } finally {
        setBookingInProgress(null);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-text-primary">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onBookTicket={handleBookTicket}
            isBooked={myTickets.some(t => t.eventId === event.id)}
            isLoggedIn={!!user}
            bookingInProgress={bookingInProgress === event.id}
          />
        ))}
      </div>
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket.ticket}
          event={selectedTicket.event}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default EventCatalog;
