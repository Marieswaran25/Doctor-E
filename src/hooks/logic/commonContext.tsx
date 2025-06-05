'use client';
import React, { Dispatch, SetStateAction } from 'react';

export const CommonContext = React.createContext<{
    theme: string;
    sideBarOpen: boolean;
    setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
    setSideBarOpen: Dispatch<SetStateAction<boolean>>;
    isStreamed: boolean;
    setStreamed: Dispatch<SetStateAction<boolean>>;
}>({
    theme: 'light',
    sideBarOpen: false,
    setTheme: () => {},
    setSideBarOpen: () => {},
    isStreamed: false,
    setStreamed: () => {},
});

export const useCommonContext = () => {
    return React.useContext(CommonContext);
};
