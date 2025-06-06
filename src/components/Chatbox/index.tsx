import './chatbox.scss';

import React, { useEffect, useRef } from 'react';
import Close from '@assets/icons/close.svg';
import { Messenger } from '@components/Messenger';
import { useCommonContext } from '@hooks/logic/commonContext';
import Typography from '@library/Typography';
export const Chatbox = ({ messages, isWindowOpen, onMessage }: { isWindowOpen: boolean; messages: { message: string; source: 'ai' | 'user' }[]; onMessage: (message: string) => void }) => {
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
        <aside className={`transcription ${messages.length === 0 && !isWindowOpen ? 'none' : 'all'} ${sideBarOpen ? 'open' : 'close'}`}>
            <div className="banner">
                <Typography type="p3" weight="light" text="In-call Messages " color="white" as="p" />
                <Close
                    onClick={() => {
                        setSideBarOpen(false);
                    }}
                />
            </div>
            <div className="messages-list" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`message-wrapper ${msg.source}`}>
                        <Typography type="caption" weight="light" text={msg.message} color={msg.source === 'ai' ? 'white' : '#254156'} as="p" />
                    </div>
                ))}
            </div>

            <div className="input-box">
                <Messenger sendMessage={onMessage} />
            </div>
        </aside>
    );
};
