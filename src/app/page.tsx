import { Navbar } from '@components/Navbar';
import { VoiceChatBot } from '@components/VoiceChatBot';
import { StreamingAvatarProvider } from '@hooks/logic';
import { View } from '@library/View';
import { CommonProvider } from '@provider/commonProvider';

export default function HomePage() {
    return (
        <main style={{ position: 'relative' }}>
            <CommonProvider>
                <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_HEYGEN_URL}>
                    <Navbar />
                    <VoiceChatBot />
                </StreamingAvatarProvider>
            </CommonProvider>
        </main>
    );
}
