'use client';
import './stickyChat.scss';

import React, { Fragment } from 'react';
import Chat from '@assets/icons/chat.svg';
import { useInteractiveAvatarContext } from '@hooks/interactive-avatar/interactiveAvatarContext';

export const StickyChat = () => {
    const { setIsTranscriptionOpen, isStreamed } = useInteractiveAvatarContext();

    return (
        <Fragment>
            {isStreamed && (
                <div className="sticky-chat">
                    <Chat onClick={() => setIsTranscriptionOpen(true)} className={`chat-icon`} />
                </div>
            )}
        </Fragment>
    );
};
