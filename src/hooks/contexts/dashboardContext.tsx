'use client';
import React, { Dispatch, SetStateAction, TransitionStartFunction } from 'react';

export enum DashboardTabs {
    HOME = 'Home',
    CHAT_WITH_DOCTOR = 'Chat with Doctor',
    CHAT_HISTORY = 'Chat History',
    YOUR_REPORTS = 'Your Reports',
    DENTAL_EDUCATION = 'Dental Education',
}

export const DashboardContext = React.createContext<{
    theme: string;
    setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
    currentTab: DashboardTabs | string;
    setCurrentTab: Dispatch<SetStateAction<DashboardTabs | string>>;
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
    currentTab: DashboardTabs.HOME,
    setCurrentTab: () => {},
    isPageLoading: false,
    startPageTransition: () => {},
    clearSettings: () => {},
});

export const useDashboardSettings = () => {
    return React.useContext(DashboardContext);
};
