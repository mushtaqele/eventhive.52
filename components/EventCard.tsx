
import React from 'react';
import type { Event, Ticket } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { UserIcon } from './icons/UserIcon';
import { MOCK_USERS } from '../services/clerkService';

interface EventCardProps {
  event: Event;
  onBookTicket: (event: Event) => void;
  isBooked: boolean;
  isLoggedIn: boolean;
  bookingInProgress: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onBookTicket, isBooked, isLoggedIn, bookingInProgress }) => {
  const organizer = MOCK_USERS.find(u => u.id === event.organizerId);

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img src={`https://picsum.photos/seed/${event.id}/400/200`} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-text-primary mb-2">{event.title}</h3>
        <p className="text-text-secondary mb-4 h-20 overflow-y-auto">{event.description}</p>
        
        <div className="space-y-3 text-sm text-text-secondary mb-6">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
            <span>{event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <LocationIcon className="w-4 h-4 mr-2 text-primary" />
            <span>{event.venue}</span>
          </div>
          {organizer && (
            <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-primary" />
                <span>Organized by {organizer.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onBookTicket(event)}
          disabled={!isLoggedIn || isBooked || bookingInProgress}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-primary-hover"
        >
          {bookingInProgress ? 'Booking...' : (isBooked ? 'Ticket Booked' : (isLoggedIn ? 'Book Ticket' : 'Sign in to Book'))}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
