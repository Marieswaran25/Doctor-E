import CustomAxios from '@helpers/customAxiox';
import { Conversation } from '@hooks/interactive-avatar/context';

import { API_SERVICE_URL } from '@/config';

type ConversationRequest = {
    externalConversationId: string;
    userId: string;
    sessionId?: string;
    message: Conversation[];
};
type ConversationResponse = {
    id: string;
    conversation: {
        messages: Conversation[];
    };
    createdAt: string;
    externalConversationId: string;
};
export const exportConversation = async ({ externalConversationId, userId, sessionId, message }: ConversationRequest): Promise<ConversationResponse> => {
    return new Promise((resolve, reject) => {
        CustomAxios.post(API_SERVICE_URL + '/conversations', { externalConversationId, userId, sessionId, message }, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
export const getAllConversation = async (): Promise<{ conversations: ConversationResponse[] }> => {
    return new Promise((resolve, reject) => {
        CustomAxios.get(API_SERVICE_URL + `/conversations`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
