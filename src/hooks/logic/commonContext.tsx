'use client';
import React, { Dispatch, SetStateAction } from 'react';

export const InteractiveAvatarContext = React.createContext<{
    isTranscriptionOpen: boolean;
    setIsTranscriptionOpen: Dispatch<SetStateAction<boolean>>;
    isStreamed: boolean;
    setStreamed: Dispatch<SetStateAction<boolean>>;
    isUploadDialogBoxopen: boolean;
    setIsUploadDialogBoxopen: Dispatch<SetStateAction<boolean>>;
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
    isTranscriptionOpen: false,
    setIsTranscriptionOpen: () => {},
    isStreamed: false,
    setStreamed: () => {},
    isUploadDialogBoxopen: false,
    setIsUploadDialogBoxopen: () => {},
    diagnosis: null,
    setDiagnosis: () => {},
    cleanUpCommonContext: () => {},
});

export const useInteractiveAvatarContext = () => {
    return React.useContext(InteractiveAvatarContext);
};
