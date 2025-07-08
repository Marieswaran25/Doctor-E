'use client';
import { AuthContext } from '@hooks/logic/authContext';
import { useProfile } from '@hooks/useProfile';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { profile, setProfile, isLoading, error } = useProfile();
    return (
        <AuthContext.Provider
            value={{
                profile,
                setProfile,
                isLoading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
