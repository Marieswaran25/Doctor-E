'use client';
import React from 'react';
import { ConversationHistory } from '@components/Dashboard/ConversationHistory';
import { View } from '@library/View';

import AuthLayout from '@/layout/authLayout';

export default function ChatHistoryPage() {
    return (
        <AuthLayout>
            <View className="chat-history-container" style={{ paddingTop: '1.5rem', paddingBottom: '0rem' }}>
                <ConversationHistory />
            </View>
        </AuthLayout>
    );
}
