
import type { Event, Ticket } from '../types';

// --- MOCK DATABASE ---
const mockEvents: Event[] = [
  {
    id: 'evt_1',
    title: 'React Conference 2024',
    description: 'The biggest React conference in the world. Join us for 3 days of talks from the React team and community.',
    date: new Date('2024-10-26T09:00:00Z'),
    organizerId: 'user_2', // Bob (Organizer)
    venue: 'Virtual',
  },
  {
    id: 'evt_2',
    title: 'VueJS Amsterdam',
    description: 'A fantastic conference for all Vue enthusiasts. Learn from the best and connect with the community.',
    date: new Date('2024-11-12T10:00:00Z'),
    organizerId: 'org_another',
    venue: 'Amsterdam, NL',
  },
  {
    id: 'evt_3',
    title: 'AI in Web Development',
    description: 'An evening meetup exploring the latest trends in AI and its applications in modern web development.',
    date: new Date('2024-09-30T18:00:00Z'),
    organizerId: 'user_2',
    venue: 'Tech Hub, San Francisco',
  },
];

const mockTickets: Ticket[] = [
  { id: 'tkt_1', eventId: 'evt_1', userId: 'user_3', qrCode: 'tkt_1', createdAt: new Date() },
];
// --- END MOCK DATABASE ---

type TicketCountCallback = (count: number) => void;
const ticketCountSubscriptions: Record<string, TicketCountCallback[]> = {};

// Simulate other users booking tickets to show real-time functionality
setInterval(() => {
  const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
  const newTicket: Ticket = {
    id: `tkt_${Date.now()}`,
    eventId: randomEvent.id,
    userId: `user_random_${Date.now()}`,
    qrCode: `tkt_${Date.now()}`,
    createdAt: new Date(),
  };
  mockTickets.push(newTicket);
  
  // Notify subscribers
  if (ticketCountSubscriptions[randomEvent.id]) {
    const newCount = mockTickets.filter(t => t.eventId === randomEvent.id).length;
    ticketCountSubscriptions[randomEvent.id].forEach(cb => cb(newCount));
  }
}, 5000); // Add a new ticket every 5 seconds

const delay = <T,>(data: T, ms = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const supabaseService = {
  getEvents: async (): Promise<Event[]> => {
    return delay([...mockEvents].sort((a, b) => a.date.getTime() - b.date.getTime()));
  },

  getEventsByOrganizer: async (organizerId: string): Promise<Event[]> => {
    const events = mockEvents.filter(e => e.organizerId === organizerId);
    return delay(events);
  },

  getTicketsByUser: async (userId: string): Promise<Ticket[]> => {
    const userTickets = mockTickets.filter(t => t.userId === userId);
    const enrichedTickets = userTickets.map(ticket => {
        const event = mockEvents.find(e => e.id === ticket.eventId);
        return { ...ticket, event };
    }).filter(t => t.event) as (Ticket & {event: Event})[];
    return delay(enrichedTickets.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  },
  
  getTicketsByEvent: async (eventId: string): Promise<Ticket[]> => {
    const tickets = mockTickets.filter(t => t.eventId === eventId);
    return delay(tickets);
  },

  bookTicket: async (eventId: string, userId: string): Promise<Ticket> => {
    const existingTicket = mockTickets.find(t => t.eventId === eventId && t.userId === userId);
    if (existingTicket) {
      throw new Error("Ticket already booked for this event.");
    }

    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      eventId,
      userId,
      qrCode: `tkt_${Date.now()}`,
      createdAt: new Date(),
    };
    mockTickets.push(newTicket);
    
    // Notify subscribers
    if (ticketCountSubscriptions[eventId]) {
        const newCount = mockTickets.filter(t => t.eventId === eventId).length;
        ticketCountSubscriptions[eventId].forEach(cb => cb(newCount));
    }
    
    return delay(newTicket);
  },

  subscribeToTicketCount: (eventId: string, callback: TicketCountCallback): (() => void) => {
    if (!ticketCountSubscriptions[eventId]) {
      ticketCountSubscriptions[eventId] = [];
    }
    ticketCountSubscriptions[eventId].push(callback);

    // initial count
    const initialCount = mockTickets.filter(t => t.eventId === eventId).length;
    callback(initialCount);

    // Return unsubscribe function
    return () => {
      ticketCountSubscriptions[eventId] = ticketCountSubscriptions[eventId].filter(cb => cb !== callback);
    };
  }
};
