'use client';
import React from 'react';
import { CommonContext } from '@hooks/logic/commonContext';

export const CommonProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [isStreamed, setIsStreamed] = React.useState(false);
    const [isUploadOpen, setIsUploadOpen] = React.useState(false);
    const [diagnosis, setDiagnosis] = React.useState<{
        response: string;
        reportType: string;
        image: string;
        selectedTooth: string;
    } | null>(null);

    const cleanUpCommonContext = () => {
        setIsSideBarOpen(false);
        setIsStreamed(false);
        setIsUploadOpen(false);
        setDiagnosis(null);
    };

    return (
        <CommonContext.Provider
            value={{
                isUploadOpen,
                cleanUpCommonContext,
                diagnosis,
                setDiagnosis,
                setUploadOpen: setIsUploadOpen,
                theme,
                isStreamed,
                setStreamed: setIsStreamed,
                setTheme,
                sideBarOpen: isSideBarOpen,
                setSideBarOpen: setIsSideBarOpen,
            }}
        >
            {children}
        </CommonContext.Provider>
    );
};
