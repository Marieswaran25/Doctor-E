import './chatbox.scss';

import React, { useEffect, useMemo, useRef } from 'react';
import Close from '@assets/icons/close.svg';
import { Messenger } from '@components/Dashboard/InteractiveAvatar/Messenger';
import { useInteractiveAvatarContext } from '@hooks/logic/commonContext';
import { MessageAttachments } from '@hooks/logic/context';
import { useConversationMessages } from '@hooks/logic/useConversationMessage';
import Typography from '@library/Typography';
import Image from 'next/image';

export const AttachmentHeader = React.memo(({ msg }: { msg: { attachments: MessageAttachments } }) => {
    const urls = useMemo(() => {
        return Array.isArray(msg?.attachments.files)
            ? msg?.attachments.files?.map(file => ({
                  file,
                  url: URL.createObjectURL(file),
              }))
            : [];
    }, [msg.attachments.files]);

    return (
        <div className="message-attachment-wrapper">
            <Typography type="caption" weight="light" text={msg.attachments.prompt} color={'#254156'} as="p" />
            <div className="attached-images" style={{ border: 'none' }}>
                {urls.map(({ url }, i) => (
                    <Image src={url} key={i} alt="image" width={80} height={80} />
                ))}
            </div>
        </div>
    );
});

AttachmentHeader.displayName = 'AttachmentHeader';

export const Chatbox = React.memo(
    ({
        isWindowOpen,
        children,
        onMessage,
        onContextualUpdate,
    }: {
        children?: React.ReactNode;
        isWindowOpen: boolean;
        onMessage: (message: string, attachments?: MessageAttachments) => void;
        onContextualUpdate: (message: string) => void;
    }) => {
        const scrollRef = useRef<HTMLDivElement>(null);
        const { isTranscriptionOpen, setIsTranscriptionOpen } = useInteractiveAvatarContext();
        const { conversationMessages } = useConversationMessages();
        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, [conversationMessages]);
        return (
            <aside className={`transcription ${conversationMessages.length === 0 && !isWindowOpen ? 'none' : 'all'} ${isTranscriptionOpen ? 'open' : 'close'}`}>
                <div className="banner">
                    <Typography type="p3" weight="light" text="In-call Messages " color="white" as="p" />
                    <Close
                        onClick={() => {
                            setIsTranscriptionOpen(false);
                        }}
                    />
                </div>
                <div className="messages-list" ref={scrollRef}>
                    {conversationMessages.map((msg, i) => (
                        <div key={i} className={`message-wrapper ${msg.source}`}>
                            {msg.attachments ? (
                                <AttachmentHeader
                                    msg={{
                                        attachments: msg.attachments,
                                    }}
                                />
                            ) : (
                                <Typography type="caption" weight="light" text={msg.message} color={msg.source === 'ai' ? 'white' : '#254156'} as="p" />
                            )}
                        </div>
                    ))}
                </div>

                {children}

                <div className="chat-box">
                    <Messenger onMessage={onMessage} onContextualUpdate={onContextualUpdate} />
                </div>
            </aside>
        );
    },
);

Chatbox.displayName = 'Chatbox';
