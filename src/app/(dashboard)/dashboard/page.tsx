'use client';
import { Fragment, useEffect } from 'react';
import { ROUTES } from '@constants/routes';
import { useNavigation } from '@hooks/useNavigation';

export default function Dashboard() {
    const router = useNavigation();
    useEffect(() => {
        router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Fragment />;
}
