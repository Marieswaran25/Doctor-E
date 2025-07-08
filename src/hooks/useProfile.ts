'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMe, GetMeResponse } from '@services/api/auth';

import { useFetch } from './useFetch';

export function useProfile() {
    const memoizedProfile = useCallback(() => getMe(), []);
    const [profile, setProfile, error, isLoading] = useFetch(memoizedProfile);

    return {
        profile,
        setProfile,
        isLoading,
        error,
    };
}
