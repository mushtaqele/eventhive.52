
import React, { useState, useEffect } from 'react';
import type { Event } from '../types';
import { supabaseService } from '../services/supabaseService';
import { UsersIcon } from './icons/UsersIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface OrganizerEventCardProps {
  event: Event;
}

const OrganizerEventCard: React.FC<OrganizerEventCardProps> = ({ event }) => {
  const [attendeeCount, setAttendeeCount] = useState(0);

  useEffect(() => {
    const unsubscribe = supabaseService.subscribeToTicketCount(event.id, (count) => {
      setAttendeeCount(count);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-text-primary">{event.title}</h3>
        <div className="flex items-center text-sm text-text-secondary mt-1">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{event.date.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end text-primary">
          <UsersIcon className="w-6 h-6 mr-2" />
          <span className="text-3xl font-bold">{attendeeCount}</span>
        </div>
        <p className="text-sm text-text-secondary">Attendees</p>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
