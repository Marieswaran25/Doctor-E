import { useStreamingAvatarContext } from './context';

export const useConversationMessages = () => {
    const { conversationMessages, setConversationMessages } = useStreamingAvatarContext();

    return { conversationMessages, setConversationMessages };
};
