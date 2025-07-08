'use client';
import React from 'react';
import { GetMeResponse } from '@services/api/auth';

export const AuthContext = React.createContext<{
    profile: GetMeResponse | null;
    setProfile: React.Dispatch<React.SetStateAction<GetMeResponse | null>>;
    isLoading: boolean;
    error: string;
}>({
    profile: null,
    setProfile: () => {},
    isLoading: false,
    error: '',
});
export const useAuthContext = () => {
    return React.useContext(AuthContext);
};
