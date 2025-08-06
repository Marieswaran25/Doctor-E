import { Fragment, useEffect } from 'react';
import { ROUTES } from '@constants/routes';
import { LocalStorage, removeStorageKey } from '@helpers/storage';
import { useNavigation } from '@hooks/useNavigation';
import { useQueryClient } from '@tanstack/react-query';

import { unAuthorizedEvent } from '@/config';

export default function GlobalAuthHandler() {
    const router = useNavigation();
    const queryClient = useQueryClient();
    useEffect(() => {
        const handleLogout = () => {
            removeStorageKey(LocalStorage.ACCESS_TOKEN);
            queryClient.clear();
            router.push(ROUTES.SIGN_IN);
        };

        window.addEventListener(unAuthorizedEvent, handleLogout);

        return () => {
            window.removeEventListener(unAuthorizedEvent, handleLogout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Fragment />;
}
