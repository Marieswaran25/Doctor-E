import React, { useEffect } from 'react';

export function useFetch<T>(action: () => Promise<T>, shouldCall = true) {
    const [isLoading, startTransaction] = React.useTransition();
    const [error, setError] = React.useState<string>('');
    const [data, setData] = React.useState<T | null>(null);

    useEffect(() => {
        let isMounted = true;
        if (!shouldCall)
            return () => {
                isMounted = false;
            };

        startTransaction(async () => {
            try {
                const result = await action();
                if (isMounted) setData(result);
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.response?.data?.error_message || err?.message || 'Something went wrong');
                }
            }
        });

        return () => {
            isMounted = false;
        };
    }, [action, shouldCall, startTransaction]);

    return [data, setData, error, isLoading] as const;
}
