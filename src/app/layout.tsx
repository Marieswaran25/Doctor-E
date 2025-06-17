import './globals.scss';

import { Navbar } from '@components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
// import Script from 'next/script';

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
                <Navbar />
                {children}
                {/* <Script src='https://widget-omega-three.vercel.app/widget.js' async id="elatre-voice" />
                <elatre-voice agent-id="agent_01jw809vgmex7agff0vpz1mez2"></elatre-voice> */}
                <Analytics />
            </body>
        </html>
    );
}
