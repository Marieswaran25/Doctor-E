import CustomAxios from '@helpers/customAxiox';
import axios from 'axios';

import { API_SERVICE_URL } from '@/config';

export type GetMeResponse = {
    id: string;
    username: string;
    email: string;
    mobileNumber?: string | null;
    profileUrl?: string | null;
    loginType: 'default' | 'google';
    metadata: string | null;
    emailVerified?: boolean;
    blacklisted?: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
};

type SignUpUserRequest = {
    email: string;
    password: string;
    username: string;
    mobileNumber: string;
    metadata?: Partial<{
        location: string;
        language: string;
    }>;
};
export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    userId: string;
    roles: string[];
};
export const loginWithGoogle = async ({ token, code }: { token?: string; code?: string }): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
        CustomAxios.post(API_SERVICE_URL + '/sign-in/google', { token, code }, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const basicAuthLogin = async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .post(API_SERVICE_URL + '/login', { email, password }, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const signUpUser = async (data: SignUpUserRequest): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .post(API_SERVICE_URL + '/users', data, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const getMe = async (): Promise<GetMeResponse> => {
    return new Promise((resolve, reject) => {
        CustomAxios.get(API_SERVICE_URL + '/users/me', { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const rotateRefresToken = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
        CustomAxios.post(API_SERVICE_URL + '/refresh', {}, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const logout = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
        CustomAxios.post(API_SERVICE_URL + '/logout', {}, { withCredentials: true })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
