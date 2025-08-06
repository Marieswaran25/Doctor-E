'use client';

import colors from '@theme/colors.module.scss';

import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { InitialGreeting } from '@components/Dashboard/Global/InitialGreeting';
import { ROUTES } from '@constants/routes';
import { useDashboardSettings } from '@hooks/interactive-avatar/dashboardContext';
import { useNavigation } from '@hooks/useNavigation';
import { useProfile } from '@hooks/useProfile';
import { Loader } from '@library/Loader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isPageLoading, currentTab } = useDashboardSettings();
    const { profile, isLoading: profileLoading, error } = useProfile();
    const router = useNavigation();

    useEffect(() => {
        if (error && !profile) {
            toast.error(error?.message || 'Your session has expired. Please login again.', {
                duration: 1000,
            });
            let interval: NodeJS.Timeout | null = null;
            interval = setInterval(() => {
                router.push(ROUTES.SIGN_IN);
            }, 1000);
            return () => {
                if (interval) {
                    clearInterval(interval);
                }
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, profile]);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            {profileLoading || !profile || isPageLoading ? (
                <Loader borderTopColor={colors.Gray3} className="dashboard-loader" />
            ) : (
                <>
                    {profile && <InitialGreeting items={['Dashboard', currentTab]} />}
                    {children}
                </>
            )}
        </>
    );
}
