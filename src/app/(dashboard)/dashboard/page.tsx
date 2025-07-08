'use client';
import { Fragment, useEffect } from 'react';
import { ROUTES } from '@constants/routes';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    useEffect(() => {
        router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Fragment />;
}
