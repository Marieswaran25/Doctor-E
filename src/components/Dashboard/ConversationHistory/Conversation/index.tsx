import './conversation.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';
import Arrow from '@assets/icons/rightArrow.svg';
import { AttachmentHeader } from '@components/Dashboard/InteractiveAvatar/Chatbox';
import { Conversation as ConversationType } from '@hooks/interactive-avatar/context';
import Typography from '@library/Typography';

export const Conversation = ({ item, convoId, dateTime, isOpen, toggle }: { isOpen: boolean; toggle: () => void; item: ConversationType[]; convoId: string; dateTime: string }) => {
    return (
        <div
            className="conversation-outer-wrapper"
            onClick={e => {
                e.stopPropagation();
                toggle();
            }}
        >
            <div className="conversation-header">
                <div className="conversation-info">
                    <Typography type="p3" weight="regular" text={convoId} color={isOpen ? colors.Gray3 : 'black'} as="p" />
                    <Typography type="caption" weight="light" text={dateTime} color="gray" as="span" />
                </div>
                <Arrow className={`arrow ${isOpen ? 'open' : ''}`} />
            </div>
            <div className={`conversation-expandable ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                {item.map((msg, i) => {
                    return (
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
                    );
                })}
            </div>
        </div>
    );
};
