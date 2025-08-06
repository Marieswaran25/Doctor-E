'use client';
import './layout.scss';

import GlobalAuthHandler from '@components/Auth';
import { DashboardNavbar } from '@components/Dashboard/DashboardNavbar';
import { Sidebar } from '@components/Dashboard/Sidebar';
import { SettingsProvider } from '@provider/dashboardProvider';
import { InteractiveAvatarProvider } from '@provider/interactiveAvatarProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { APP_ENV } from '@/config';

const queryClient = new QueryClient();
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            {APP_ENV && <ReactQueryDevtools initialIsOpen={true} />}
            <GlobalAuthHandler />
            <SettingsProvider>
                <InteractiveAvatarProvider>
                    <DashboardNavbar />
                    <Sidebar />
                    <div className="root-layout">{children}</div>
                </InteractiveAvatarProvider>
            </SettingsProvider>
        </QueryClientProvider>
    );
}
