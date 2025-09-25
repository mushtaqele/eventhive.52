
export interface ClerkUser {
  id: string;
  name: string;
  role: 'user' | 'organizer';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  organizerId: string;
  venue: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  qrCode: string; // This will hold the ticket ID for QR generation
  createdAt: Date;
  event?: Event; // populated for display
}

export type Page = 'catalog' | 'dashboard' | 'my-tickets';
