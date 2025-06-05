'use client';
import React, { useEffect } from 'react';
import { CommonContext } from '@hooks/logic/commonContext';

export const CommonProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [isStreamed, setIsStreamed] = React.useState(false);

    return (
        <CommonContext.Provider value={{ theme, isStreamed, setStreamed: setIsStreamed, setTheme, sideBarOpen: isSideBarOpen, setSideBarOpen: setIsSideBarOpen }}>{children}</CommonContext.Provider>
    );
};
