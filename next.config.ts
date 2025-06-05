/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config: any) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dummyjson.com',
                port: '',
                pathname: '/icon/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
