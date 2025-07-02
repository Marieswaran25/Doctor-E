'use client';
import React, { Dispatch, SetStateAction } from 'react';

export const CommonContext = React.createContext<{
    theme: string;
    sideBarOpen: boolean;
    setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
    setSideBarOpen: Dispatch<SetStateAction<boolean>>;
    isStreamed: boolean;
    setStreamed: Dispatch<SetStateAction<boolean>>;
    isUploadOpen: boolean;
    setUploadOpen: Dispatch<SetStateAction<boolean>>;
    diagnosis: {
        response: string;
        reportType: string;
        image: string;
        selectedTooth: string;
        age?: number;
        name?: string;
    } | null;
    setDiagnosis: Dispatch<
        SetStateAction<{
            response: string;
            reportType: string;
            image: string;
            selectedTooth: string;
            age?: number;
            name?: string;
        } | null>
    >;
    cleanUpCommonContext: () => void;
}>({
    theme: 'light',
    sideBarOpen: false,
    setTheme: () => {},
    setSideBarOpen: () => {},
    isStreamed: false,
    setStreamed: () => {},
    isUploadOpen: false,
    setUploadOpen: () => {},
    diagnosis: null,
    setDiagnosis: () => {},
    cleanUpCommonContext: () => {},
});

export const useCommonContext = () => {
    return React.useContext(CommonContext);
};
