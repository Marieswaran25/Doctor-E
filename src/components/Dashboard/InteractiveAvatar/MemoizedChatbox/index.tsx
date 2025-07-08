import React from 'react';
import { MessageAttachments } from '@hooks/logic/context';

import { Chatbox } from '../Chatbox';

export const MemoizedChatBox = React.memo(
    ({
        isWindowOpen,
        children,
        onMessage,
        onContextualUpdate,
    }: {
        isWindowOpen: boolean;
        children?: React.ReactNode;
        onContextualUpdate: (m: string) => void;
        onMessage: (message: string, attachments?: MessageAttachments) => void;
    }) => {
        return (
            <Chatbox isWindowOpen={isWindowOpen} onMessage={onMessage} onContextualUpdate={onContextualUpdate}>
                {children}
            </Chatbox>
        );
    },
);
MemoizedChatBox.displayName = 'MemoizedChatBox';
