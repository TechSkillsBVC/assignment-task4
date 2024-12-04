import { createContext } from 'react';
import { User } from '../types/User';

export type AuthenticationContextObject = {
    value: User | null;
    setValue: (newValue: User | undefined) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextObject | null>(null);
