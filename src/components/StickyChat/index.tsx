'use client';
import './stickyChat.scss';

import React, { Fragment } from 'react';
import Chat from '@assets/icons/chat.svg';
import { useCommonContext } from '@hooks/logic/commonContext';

export const StickyChat = () => {
    const { setSideBarOpen, isStreamed } = useCommonContext();

    return (
        <Fragment>
            {isStreamed && (
                <div className="sticky-chat">
                    <Chat onClick={() => setSideBarOpen(true)} className={`chat-icon`} />
                </div>
            )}
        </Fragment>
    );
};
