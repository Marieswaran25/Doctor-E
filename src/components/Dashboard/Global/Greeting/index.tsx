'use client';
import './greeting.scss';
import colors from '@theme/colors.module.scss';

import { useMemo } from 'react';
import { DashboardTabs, useDashboardSettings } from '@hooks/contexts/dashboardContext';
import { useProfile } from '@hooks/useProfile';
import Typography from '@library/Typography';

export const Greeting = () => {
    const { profile } = useProfile();
    const { currentTab } = useDashboardSettings();

    const greeting = useMemo(() => {
        const currentTime = new Date().getHours();
        if (currentTime < 12) {
            return 'Good Morning';
        } else if (currentTime < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    }, []);

    return (
        <div className="greeting">
            <Typography type="h1" weight="regular" text={`${greeting}, ${profile?.username}👋`} color={colors.Gray3} as="h6" />
            <Typography type="p2" weight="light" text={currentTab === DashboardTabs.HOME ? 'How can I help you today?' : 'Here’s what we’ve got for you.'} color={colors.Gray3} as="p" />
        </div>
    );
};
