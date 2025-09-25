
import React from 'react';
import type { ClerkUser } from '../types';

interface AuthContextType {
  user: ClerkUser | null;
  signIn: (userId: string) => void;
  signOut: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});
