
import type { ClerkUser } from '../types';

export const MOCK_USERS: ClerkUser[] = [
  { id: 'user_1', name: 'Alice', role: 'user' },
  { id: 'user_2', name: 'Bob (Organizer)', role: 'organizer' },
  { id: 'user_3', name: 'Charlie', role: 'user' },
];

// In a real app, this file would contain functions to interact with the Clerk SDK.
// For this mock, we just export the user data.
