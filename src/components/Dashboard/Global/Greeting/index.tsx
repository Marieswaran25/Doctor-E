'use client';
import './greeting.scss';
import colors from '@theme/colors.module.scss';

import { useMemo } from 'react';
import { useAuthContext } from '@hooks/logic/authContext';
import Typography from '@library/Typography';
import { View } from '@library/View';

export const Greeting = () => {
    const { profile } = useAuthContext();

    const greeting = useMemo(() => {
        const currentTime = new Date().getHours();
        console.log(currentTime);
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
            <Typography type="h2" weight="regular" text={`${greeting}, ${profile?.username}👋`} color={colors.Gray3} as="h6" />
        </div>
    );
};
