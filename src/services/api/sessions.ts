import CustomAxios from '@helpers/customAxiox';
import { Conversation } from '@hooks/logic/context';

import { API_SERVICE_URL } from '@/config';

export const createSession = async ({ externalSessionId }: { externalSessionId: string }): Promise<{ sessionId: string }> => {
    return new Promise((resolve, reject) => {
        CustomAxios.post(API_SERVICE_URL + '/sessions', { externalSessionId }, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
export const closeSession = async ({ sessionId, externalConversationId, message }: { sessionId: string; externalConversationId: string; message: Conversation[] }): Promise<{ sessionId: string }> => {
    return new Promise((resolve, reject) => {
        CustomAxios.patch(API_SERVICE_URL + `/sessions/${sessionId}/end`, { externalConversationId, message }, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
export const getSession = async ({ sessionId }: { sessionId: string }): Promise<{ sessionId: string; duration: number; timeInNotation: string }> => {
    return new Promise((resolve, reject) => {
        CustomAxios.get(API_SERVICE_URL + `/sessions/${sessionId}`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
