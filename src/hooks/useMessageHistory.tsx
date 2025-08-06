'use client';

import { getAllConversation } from '@services/api/conversations';
import { useQuery } from '@tanstack/react-query';

import { useProfile } from './useProfile';

export function useConversationHistory() {
    const { profile } = useProfile();

    const {
        data: conversation,
        error: convoError,
        isLoading: convoLoading,
    } = useQuery({
        queryKey: ['conversations'],
        queryFn: getAllConversation,
        enabled: !!profile?.id,
    });

    return {
        conversation,
        convoError,
        convoLoading,
    };
}
