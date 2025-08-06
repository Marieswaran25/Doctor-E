'use client';
import React, { TransitionStartFunction } from 'react';
import { ROUTES } from '@constants/routes';
import { LocalStorage, setStorageKey } from '@helpers/storage';
import { useNavigation } from '@hooks/useNavigation';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { loginWithGoogle } from '@services/api/auth';

export const OneTapGoogleLogin = ({ startGoogleSignInTrxn }: { startGoogleSignInTrxn: TransitionStartFunction }) => {
    const router = useNavigation();
    useGoogleOneTapLogin({
        onSuccess: tokenResponse => {
            startGoogleSignInTrxn(async () => {
                try {
                    const token = tokenResponse.credential;
                    if (token) {
                        console.log(token);
                        const { accessToken } = await loginWithGoogle({ token });
                        console.log(accessToken);
                        setStorageKey(LocalStorage.ACCESS_TOKEN, accessToken);
                        console.log('success');
                        router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        },
        auto_select: true,
        onError: () => console.log('error'),
        cancel_on_tap_outside: true,
    });
    return <React.Fragment />;
};
