import CustomAxios from '@helpers/customAxiox';

import { API_SERVICE_URL } from '@/config';

type ServiceAvailabilityResponse = {
    status: 'operational' | 'unavailable';
    heygen: {
        status: 'operational' | 'unavailable';
        total: number;
        used: number;
        remaining: number;
        affectedComponents: any[];
    };
    elevenlabs: {
        status: 'operational' | 'unavailable';
        total: number;
        used: number;
        remaining: number;
        affectedComponents: any[];
    };
};

export const getSerivesAvailablity = async (): Promise<ServiceAvailabilityResponse> => {
    return new Promise((resolve, reject) => {
        CustomAxios.get(API_SERVICE_URL + `/services/availability`, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
