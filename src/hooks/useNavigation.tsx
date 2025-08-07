import { ROUTES } from '@constants/routes';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
    const router = useRouter();

    const push = (r: ROUTES | string, query?: Array<Record<string, string>>) => {
        if (!query) return router.push(r);
        else {
            const concatenatedQuery = query
                .map(q =>
                    Object.entries(q)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&'),
                )
                .join('&');
            return router.push(`${r}?${concatenatedQuery}`);
        }
    };

    const replace = (r: ROUTES | string, query?: Array<Record<string, string>>) => {
        if (!query) return router.replace(r);
        else {
            const concatenatedQuery = query
                .map(q =>
                    Object.entries(q)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&'),
                )
                .join('&');
            return router.push(`${r}?${concatenatedQuery}`);
        }
    };

    return {
        push,
        replace,
    } as const;
};
