'use client';
import './layout.scss';

import { DashboardNavbar } from '@components/Dashboard/DashboardNavbar';
import { Sidebar } from '@components/Dashboard/Sidebar';
import { AuthProvider } from '@provider/authProvider';
import { SettingsProvider } from '@provider/dashboardProvider';
import { InteractiveAvatarProvider } from '@provider/interactiveAvatarProvider';
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <SettingsProvider>
                <InteractiveAvatarProvider>
                    <DashboardNavbar />
                    <Sidebar />
                    <div className="root-layout">{children}</div>
                </InteractiveAvatarProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
