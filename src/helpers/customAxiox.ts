import { ROUTES } from '@constants/routes';
import { rotateRefresToken } from '@services/api/auth';
import axios, { AxiosInstance, isAxiosError } from 'axios';

import { API_SERVICE_URL, unAuthorizedEvent } from '@/config';

import { getStorageKey, LocalStorage, removeStorageKey, setStorageKey } from './storage';

export const CustomAxios: AxiosInstance = axios.create({
    baseURL: API_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true, //indicates request use cookies or headers.Authorization
});

/* Request on first time- get token from Local storage
subsequent or failed request (403) - get new access token refreshed by Refresh API
*/

CustomAxios.interceptors.request.use(
    async config => {
        const token = getStorageKey(LocalStorage.ACCESS_TOKEN);
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

/**
 Failed request due to Forbidden error - calls Refresh token and got new accessToken
 and resend the same request now from new accessToken only once
 If refresh token expires it cleans up the local storage
 */

CustomAxios.interceptors.response.use(
    response => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (isAxiosError(error) && error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent(unAuthorizedEvent));
            return Promise.reject(error);
        }
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { accessToken } = await rotateRefresToken();
                setStorageKey(LocalStorage.ACCESS_TOKEN, accessToken);
                axios.defaults.headers.common['Authorization'] = accessToken;
                originalRequest.headers['Authorization'] = accessToken;
                return CustomAxios(originalRequest, { headers: { Authorization: accessToken } });
            } catch (refreshError) {
                removeStorageKey(LocalStorage.ACCESS_TOKEN);
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent(unAuthorizedEvent));
                }
            }
        }
        return Promise.reject(error);
    },
);

export default CustomAxios;
