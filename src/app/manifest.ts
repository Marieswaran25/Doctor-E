import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Dr.E',
        short_name: 'Dr.E',
        description: 'Elevating the future of dental care with Dr. Eduardo',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#658192',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '32x32',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
