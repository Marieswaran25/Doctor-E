'use client';

import { getMe } from '@services/api/auth';
import { useQuery } from '@tanstack/react-query';

export function useProfile() {
    const {
        data: profile,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
    });

    return {
        profile,
        isLoading,
        error,
    };
}
