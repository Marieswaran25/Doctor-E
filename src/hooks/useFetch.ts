import React, { useEffect } from 'react';

export function useFetch<T>(action: () => Promise<T>) {
    const [isLoading, startTransaction] = React.useTransition();
    const [error, setError] = React.useState<string>('');
    const [data, setData] = React.useState<T | null>(null);

    useEffect(() => {
        let isMounted = true;
        startTransaction(async () => {
            try {
                const data = await action();
                if (isMounted) setData(data);
            } catch (error: any) {
                if (isMounted) {
                    setError(error?.response?.data?.error_message || error?.message || 'Something went wrong');
                }
            }
        });
        return () => {
            isMounted = false;
        };
    }, [action]);

    return [data, setData, error, isLoading] as const;
}
