'use client';
import React from 'react';
import { DashboardContext } from '@hooks/logic/dashboardContext';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState('Chat with Doctor');
    const [isPageLoading, startPageTransition] = React.useTransition();

    const cleanUpSettings = () => {
        setIsSideBarOpen(false);
        setCurrentTab('Chat with Doctor');
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
                cleanUpSettings,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
