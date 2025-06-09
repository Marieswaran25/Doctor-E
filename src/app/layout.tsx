import './globals.scss';

import { Navbar } from '@components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
    style: 'normal',
    weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
    title: 'dr.E',
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
            <body className={roboto.className}>
                <Navbar />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
