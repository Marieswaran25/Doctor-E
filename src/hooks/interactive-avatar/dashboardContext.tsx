'use client';
import React, { Dispatch, SetStateAction, TransitionStartFunction } from 'react';

export const DashboardContext = React.createContext<{
    theme: string;
    setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
    currentTab: string;
    setCurrentTab: Dispatch<SetStateAction<string>>;
    activeSidebar: boolean;
    setActiveSidebar: Dispatch<SetStateAction<boolean>>;
    isPageLoading: boolean;
    startPageTransition: TransitionStartFunction;
    clearSettings: () => void;
}>({
    theme: 'light',
    activeSidebar: false,
    setTheme: () => {},
    setActiveSidebar: () => {},
    currentTab: 'Chat with Doctor',
    setCurrentTab: () => {},
    isPageLoading: false,
    startPageTransition: () => {},
    clearSettings: () => {},
});

export const useDashboardSettings = () => {
    return React.useContext(DashboardContext);
};
