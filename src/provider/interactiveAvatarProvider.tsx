'use client';
import React from 'react';
import { InteractiveAvatarContext } from '@hooks/interactive-avatar/interactiveAvatarContext';

export const InteractiveAvatarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isTranscriptionOpen, setIsTranscriptionOpen] = React.useState(false);
    const [isStreamed, setIsStreamed] = React.useState(false);
    const [isUploadDialogBoxopen, setisUploadDialogBoxopen] = React.useState(false);
    const [diagnosis, setDiagnosis] = React.useState<{
        response: string;
        reportType: string;
        image: string;
        selectedTooth: string;
    } | null>(null);

    const cleanUpCommonContext = () => {
        setIsTranscriptionOpen(false);
        setIsStreamed(false);
        setisUploadDialogBoxopen(false);
        setDiagnosis(null);
    };

    React.useEffect(() => {
        return () => {
            cleanUpCommonContext();
        };
    }, []);

    return (
        <InteractiveAvatarContext.Provider
            value={{
                isUploadDialogBoxopen,
                cleanUpCommonContext,
                diagnosis,
                setDiagnosis,
                setIsUploadDialogBoxopen: setisUploadDialogBoxopen,
                isStreamed,
                setStreamed: setIsStreamed,
                isTranscriptionOpen,
                setIsTranscriptionOpen,
            }}
        >
            {children}
        </InteractiveAvatarContext.Provider>
    );
};
