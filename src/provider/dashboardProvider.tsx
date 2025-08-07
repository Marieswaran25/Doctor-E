'use client';
import React from 'react';
import { DashboardContext, DashboardTabs } from '@hooks/contexts/dashboardContext';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState<DashboardTabs | string>(DashboardTabs.HOME);
    const [isPageLoading, startPageTransition] = React.useTransition();

    const clearSettings = () => {
        setIsSideBarOpen(false);
        setCurrentTab(DashboardTabs.HOME);
    };

    return (
        <DashboardContext.Provider
            value={{
                theme,
                setTheme,
                activeSidebar: isSideBarOpen,
                setActiveSidebar: setIsSideBarOpen,
                currentTab,
                setCurrentTab,
                isPageLoading,
                startPageTransition,
                clearSettings,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
