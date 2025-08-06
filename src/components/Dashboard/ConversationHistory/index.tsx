import './conversationHistory.scss';
import './conversationHistory.scss';

import React from 'react';
import { useConversationHistory } from '@hooks/useMessageHistory';
import { FallbackLine } from '@library/FallbackLine';
import Typography from '@library/Typography';

import { Conversation } from './Conversation';

export const ConversationHistory = () => {
    const { conversation, convoLoading } = useConversationHistory();
    const [currentTab, setCurrentTab] = React.useState<number | null>(null);
    return (
        <div className="conversation-history">
            {convoLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                    <FallbackLine
                        key={i}
                        lineStyle={{ width: '100%', height: '80px' }}
                        containerStyle={{ width: '100%', height: '80px', borderRadius: '10px' }}
                        className="conversation-history-fallback"
                    />
                ))
            ) : Array.isArray(conversation?.conversations) && conversation?.conversations.length > 0 ? (
                conversation.conversations
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((item, i) => (
                        <Conversation
                            key={i}
                            item={item.conversation.messages}
                            convoId={item.externalConversationId}
                            dateTime={item.createdAt}
                            isOpen={currentTab === i}
                            toggle={() => {
                                setCurrentTab(currentTab === i ? null : i);
                            }}
                        />
                    ))
            ) : (
                <Typography className="no-chat-history" type="caption" color={'gray'} weight={'light'} text={'No chat history'} />
            )}
        </div>
    );
};
