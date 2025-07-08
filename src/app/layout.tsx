import './globals.scss';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { GOOGLE_CLIENT_ID } from '@/config';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    style: 'normal',
    weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
    title: 'Dr. E | Elevating the future of dental care with Dr. Eduardo',
    openGraph: {
        images: './icon.png',
    },
    metadataBase: new URL('https://doctor-e.vercel.app/'),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    {children}
                    <Analytics />
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
