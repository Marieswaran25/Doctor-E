import { ROUTES } from '@constants/routes';
import { SessionStorage } from '@Customtypes/sessionStorage';
import { rotateRefresToken } from '@services/api/auth';
import axios, { AxiosInstance } from 'axios';

import { API_SERVICE_URL } from '@/config';

import { getAccessTokenFromSessionStorage } from './getAccessTokenFromSessionStorage';

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
        const token = getAccessTokenFromSessionStorage();
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

        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { accessToken } = await rotateRefresToken();
                localStorage.setItem(SessionStorage.ACCESS_TOKEN, accessToken);
                axios.defaults.headers.common['Authorization'] = accessToken;
                originalRequest.headers['Authorization'] = accessToken;
                return CustomAxios(originalRequest, { headers: { Authorization: accessToken } });
            } catch (refreshError) {
                localStorage.removeItem(SessionStorage.ACCESS_TOKEN);
                if (typeof window !== 'undefined') {
                    alert('Your session has expired. Please login again.');
                    window.location.href = ROUTES.SIGN_IN;
                }
            }
        }
        return Promise.reject(error);
    },
);

export default CustomAxios;
