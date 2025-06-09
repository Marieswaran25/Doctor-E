import { Navbar } from '@components/Navbar';
import { StickyChat } from '@components/StickyChat';
import { VoiceChatBot } from '@components/VoiceChatBot';
import { StreamingAvatarProvider } from '@hooks/logic';
import { CommonProvider } from '@provider/commonProvider';

export default function HomePage() {
    return (
        <main style={{ position: 'relative' }}>
            <CommonProvider>
                <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_HEYGEN_URL}>
                    <VoiceChatBot />
                    <StickyChat />
                </StreamingAvatarProvider>
            </CommonProvider>
        </main>
    );
}
