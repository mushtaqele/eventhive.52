import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import type { Ticket, Event } from '../types';

interface TicketModalProps {
  ticket: Ticket;
  event: Event;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ ticket, event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl p-8 max-w-sm w-full text-center relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-primary mb-2">Your Ticket is Confirmed!</h2>
        <p className="text-text-secondary mb-4">Show this QR code at the event entrance.</p>
        
        <div className="bg-white p-4 inline-block rounded-lg mb-6">
          <QRCode value={ticket.qrCode} size={200} />
        </div>
        
        <div className="text-left">
          <h3 className="text-xl font-semibold text-text-primary">{event.title}</h3>
          <p className="text-text-secondary">{event.date.toLocaleString()}</p>
          <p className="text-text-secondary">{event.venue}</p>
          <p className="text-xs text-gray-500 mt-4">Ticket ID: {ticket.id}</p>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TicketModal;