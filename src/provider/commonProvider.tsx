'use client';
import React, { useEffect } from 'react';
import { CommonContext } from '@hooks/logic/commonContext';

export const CommonProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [isStreamed, setIsStreamed] = React.useState(false);
    const [isTablet, setIsTablet] = React.useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1023) {
                setIsTablet(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <CommonContext.Provider value={{ theme, isStreamed, setStreamed: setIsStreamed, setTheme, sideBarOpen: isSideBarOpen, setSideBarOpen: setIsSideBarOpen, isTablet }}>
            {children}
        </CommonContext.Provider>
    );
};
