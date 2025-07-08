'use client';
import React from 'react';
import Typography from '@library/Typography';
import { View } from '@library/View';

import AuthLayout from '@/layout/authLayout';

export default function ChatHistoryPage() {
    return (
        <AuthLayout>
            <View className="chat-history-container" style={{ paddingTop: '1.5rem', paddingBottom: '0rem' }}>
                <Typography className="no-chat-history" type="caption" color={'gray'} weight={'light'} text={'No chat history'} />{' '}
            </View>
        </AuthLayout>
    );
}
