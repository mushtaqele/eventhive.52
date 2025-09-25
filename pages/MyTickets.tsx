import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useAuth } from '../hooks/useAuth';
import { supabaseService } from '../services/supabaseService';
import type { Ticket } from '../types';
import Spinner from '../components/Spinner';

const MyTickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ticketData = await supabaseService.getTicketsByUser(user.id);
      setTickets(ticketData);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Please Sign In</h2>
        <p className="text-text-secondary mt-2">Sign in to view your tickets.</p>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-text-primary">My Tickets</h2>
      {tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-card rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-2 rounded-md">
                <QRCode value={ticket.qrCode} size={128} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-text-primary">{ticket.event?.title}</h3>
                <p className="text-text-secondary">{ticket.event?.venue}</p>
                <p className="text-text-secondary">{ticket.event?.date.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">Booked on: {ticket.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-secondary text-center">You haven't booked any tickets yet.</p>
      )}
    </div>
  );
};

export default MyTickets;