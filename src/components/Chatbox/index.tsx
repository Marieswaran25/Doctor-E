import './chatbox.scss';

import React, { useEffect, useRef } from 'react';
import Close from '@assets/icons/close.svg';
import { useCommonContext } from '@hooks/logic/commonContext';
import Typography from '@library/Typography';
export const Chatbox = ({ messages, isWindowOpen }: { isWindowOpen: boolean; messages: { message: string; source: 'ai' | 'user' }[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { setSideBarOpen, sideBarOpen } = useCommonContext();
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);
    return (
        <aside className={`transcription ${messages.length === 0 && !isWindowOpen ? 'none' : 'all'} ${sideBarOpen ? 'open' : 'close'}`} ref={scrollRef}>
            <div className="banner">
                <Typography type="p3" weight="light" text="In-call Messages " color="#444746" as="p" />
                <Close
                    onClick={() => {
                        setSideBarOpen(false);
                    }}
                />
            </div>
            <div className="messages-list">
                {messages.map((msg, i) => (
                    <div key={i} className={`message-wrapper ${msg.source}`}>
                        <Typography type="caption" weight="light" text={msg.message} />
                    </div>
                ))}
            </div>
        </aside>
    );
};
