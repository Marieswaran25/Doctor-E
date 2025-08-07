'use client';
import './sidebar.scss';

import React, { useCallback } from 'react';
import Close from '@assets/icons/close.svg';
import logo from '@assets/icons/logo2.png';
import ChatHistory from '@assets/icons/sidebar/chatHistory.svg';
import Education from '@assets/icons/sidebar/education.svg';
import HomeIcon from '@assets/icons/sidebar/home.svg';
import Logout from '@assets/icons/sidebar/logout.svg';
import YourReports from '@assets/icons/sidebar/reports.svg';
import { ROUTES } from '@constants/routes';
import { DashboardTabs, useDashboardSettings } from '@hooks/contexts/dashboardContext';
import { useNavigation } from '@hooks/useNavigation';
import { useProfile } from '@hooks/useProfile';
import { Button } from '@library/Button';
import Typography from '@library/Typography';
import { googleLogout } from '@react-oauth/google';
import { logout } from '@services/api/auth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { unAuthorizedEvent } from '@/config';

const menuItem = [
    { label: DashboardTabs.CHAT_WITH_DOCTOR, icon: HomeIcon, path: ROUTES.DASHBOARD_CHAT_WITH_DOCTOR },
    { label: DashboardTabs.CHAT_HISTORY, icon: ChatHistory, path: ROUTES.DASHBOARD_CHAT_HISTORY },
    { label: DashboardTabs.YOUR_REPORTS, icon: YourReports, path: ROUTES.DASHBOARD_YOUR_REPORTS },
    { label: DashboardTabs.DENTAL_EDUCATION, icon: Education, path: ROUTES.DASHBOARD_DENTAL_EDUCATION },
    { label: 'Logout', icon: Logout, path: 'logout' },
];

export const Sidebar = () => {
    const router = useNavigation();
    const { profile } = useProfile();
    const pathname = usePathname();
    const { setCurrentTab, setActiveSidebar, activeSidebar, startPageTransition, currentTab } = useDashboardSettings();

    const handleLogout = useCallback(async () => {
        const loginMode = profile?.loginType;
        if (loginMode === 'google') {
            googleLogout();
        }
        await logout();
        window.dispatchEvent(new CustomEvent(unAuthorizedEvent));
    }, [profile?.loginType]);

    const handleNavigation = useCallback(
        (item: { label: string; icon: any; path: string }) => {
            if (item.label === currentTab) return;
            startPageTransition(async () => {
                setActiveSidebar(false);
                setCurrentTab(item.label);
                if (!item.path?.includes('/')) {
                    switch (item.path) {
                        case 'logout':
                            await handleLogout();
                            break;
                        default:
                            break;
                    }
                } else {
                    setTimeout(() => {
                        router.push(item.path);
                    }, 0);
                }
            });
        },
        [handleLogout, currentTab, router, setActiveSidebar, setCurrentTab, startPageTransition],
    );

    return (
        <>
            <div className={`sidebar ${activeSidebar ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Image
                        src={logo}
                        alt="logo"
                        width={60}
                        height={60}
                        object-fit="contain"
                        border-radius="4px"
                        onClick={() => {
                            setCurrentTab(DashboardTabs.HOME);
                            router.push(ROUTES.DASHBOARD);
                            setActiveSidebar(false);
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                    <Button color="#005b8f" label={''} onClick={() => setActiveSidebar(!activeSidebar)} backgroundColor="transparent" leftIcon={Close} />
                </div>
                {menuItem.map((item, index) => (
                    <Button
                        key={index}
                        leftIcon={item.icon}
                        className={`sidebar-buttons ${item.label === 'Logout' ? ' logout-button' : ''} ${pathname.includes(item.path) ? 'active' : ''}`}
                        label={<Typography type="p3" weight="light" text={item.label} color={pathname.includes(item.path) ? 'white' : '#254156'} />}
                        onClick={() => handleNavigation(item)}
                    ></Button>
                ))}
            </div>
            {activeSidebar && <div className="sidebar-backdrop" onClick={() => setActiveSidebar(!activeSidebar)} />}
        </>
    );
};
