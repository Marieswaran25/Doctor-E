'use client';
import { InteractiveAvatar } from '@components/Dashboard/InteractiveAvatar';
import { Caller } from '@components/Dashboard/InteractiveAvatar/Caller';
import { StickyChat } from '@components/Dashboard/StickyChat';
import { StickyUpload } from '@components/Dashboard/StickyUpload';
import { StreamingAvatarProvider } from '@hooks/logic';

import AuthLayout from '@/layout/authLayout';

export default function ChatWithDoctorPage() {
    return (
        <AuthLayout>
            <main style={{ position: 'relative' }}>
                <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_HEYGEN_URL}>
                    <InteractiveAvatar />
                    <StickyChat />
                    <StickyUpload />
                </StreamingAvatarProvider>
            </main>
        </AuthLayout>
    );
}
