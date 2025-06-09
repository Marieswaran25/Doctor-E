'use client';
import './voiceChatBot.scss';

import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { isBrowser } from 'react-device-detect';
import toast, { Toaster } from 'react-hot-toast';
import Disconnect from '@assets/icons/disconnect.svg';
import DrE from '@assets/icons/drE.webp';
import Unmute from '@assets/icons/mic.svg';
import Mute from '@assets/icons/mutedMic.svg';
import Voice from '@assets/icons/voice.svg';
import { Chatbox } from '@components/Chatbox';
import { useConversation } from '@elevenlabs/react';
import { getAudioStream } from '@helpers/getMediaStream';
import { AvatarQuality, StartAvatarRequest, VoiceChatTransport } from '@heygen/streaming-avatar';
import { StreamingAvatarSessionState, useInterrupt, useStreamingAvatarSession, useVoiceChat } from '@hooks/logic';
import { useCommonContext } from '@hooks/logic/commonContext';
import { Button } from '@library/Button';
import Typography from '@library/Typography';
import { createHeygenToken } from '@services/api/createHeygenToken';
import Image from 'next/image';

import { CONVO_AGENT_ID, HEYGEN_AVATAR_ID, HEYGEN_KNOWLEDGE_ID } from '@/config';

const DEFAULT_CONFIG: StartAvatarRequest = {
    quality: AvatarQuality.High,
    knowledgeId: HEYGEN_KNOWLEDGE_ID,
    avatarName: HEYGEN_AVATAR_ID,
    language: 'en',
    voiceChatTransport: VoiceChatTransport.WEBSOCKET,
    disableIdleTimeout: true,
    voice: {
        elevenlabsSettings: {
            similarity_boost: 1,
            stability: 0.2,
        },
    },
};

const MemoizedChatBox = React.memo(
    ({ messages, isWindowOpen, onMessage }: { isWindowOpen: boolean; messages: Array<{ message: string; source: 'ai' | 'user' }>; onMessage: (message: string) => void }) => {
        return <Chatbox messages={messages} isWindowOpen={isWindowOpen} onMessage={onMessage} />;
    },
);
MemoizedChatBox.displayName = 'MemoizedChatBox';
export const VoiceChatBot = () => {
    const [muteMic, setMuteMic] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { sideBarOpen } = useCommonContext();

    const [connectionEstablished, setConnectionEstablished] = useState(false);
    const [messages, setMessages] = useState<Array<{ message: string; source: 'ai' | 'user' }>>([]);
    const [isLoading, startTrxn] = useTransition();

    const { avatarRef, stream, startAvatar, stopAvatar, sessionState, sendMessageSync } = useStreamingAvatarSession();
    const { interrupt } = useInterrupt();
    const { startVoiceChat, stopVoiceChat, muteInputAudio, unmuteInputAudio } = useVoiceChat();
    const { setSideBarOpen, setStreamed } = useCommonContext();

    const conversations = useConversation({
        micMuted: muteMic,
        onError: msg => console.error('[Error]', msg),
        onMessage: async msg => {
            if (msg.source === 'ai' && avatarRef.current) {
                try {
                    await sendMessageSync(msg.message);
                } catch (e: any) {
                    toast.error(e?.message || 'Failed to connect');
                }
            } else {
                interrupt();
            }
            setMessages(prev => [...prev, msg]);
        },
        onDisconnect: async () => {
            try {
                if (sessionState === StreamingAvatarSessionState.CONNECTED) {
                    await stopAvatar();
                }
            } catch {
            } finally {
                setSideBarOpen(false);
                setMessages([]);
                stopVoiceChat();
                setStreamed(false);
                setTimeout(() => {
                    setConnectionEstablished(false);

                    if (videoRef.current) {
                        videoRef.current.srcObject = null;
                    }
                    if (avatarRef.current) {
                        avatarRef.current = null;
                    }
                }, 10);
            }
        },
        volume: 0,
    });

    const { status, isSpeaking, sendUserMessage } = conversations;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(async () => {
                toast.error('Failed to play video');
                await Promise.all([stopAvatar(), stopVoiceChat(), conversations.endSession()]);
                setConnectionEstablished(false), setMessages([]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream]);

    const handleStart = () => {
        startTrxn(async () => {
            if (status === 'connected') {
                try {
                    await conversations.endSession();
                } catch {}
            }

            if (sessionState === StreamingAvatarSessionState.CONNECTED) {
                await stopAvatar();
            }

            try {
                const token = await createHeygenToken();
                console.log('token', token);
                await startAvatar(DEFAULT_CONFIG, token);
                setConnectionEstablished(true);

                await getAudioStream();
                await startVoiceChat(!muteMic);

                await conversations.startSession({ agentId: CONVO_AGENT_ID });
                setStreamed(true);
                toast.success('Connected');
                setTimeout(() => {
                    if (isBrowser) {
                        setSideBarOpen(true);
                    }
                }, 100);
            } catch (err: any) {
                toast.error(err?.message || 'Failed to start session');
                setConnectionEstablished(false);
                avatarRef.current = null;
            }
        });
    };
    const handleStop = useCallback(async () => {
        try {
            await Promise.all([conversations.endSession(), stopAvatar()]);
        } catch (err) {
            toast.error('Failed to stop session');
        } finally {
            setSideBarOpen(false);
            setMessages([]);
            stopVoiceChat();
            setStreamed(false);
            setTimeout(() => {
                setConnectionEstablished(false);

                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                if (avatarRef.current) {
                    avatarRef.current = null;
                }
            }, 10);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMute = useCallback(() => {
        setMuteMic(prev => !prev);

        setTimeout(() => {
            if (muteMic) {
                unmuteInputAudio();
            } else {
                muteInputAudio();
            }
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [muteInputAudio, unmuteInputAudio]);

    const isVideoStreamed = useMemo(() => {
        return avatarRef.current && status === 'connected' && connectionEstablished;
    }, [avatarRef, status, connectionEstablished]);

    const handleTextMessages = useCallback(
        (message: string) => {
            if (!message) return;
            interrupt();
            sendUserMessage(message);
            setMessages(prev => [...prev, { message, source: 'user' }]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sendUserMessage],
    );

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <section className={`voice-chat-bot ${sideBarOpen && isVideoStreamed ? 'open' : 'close'}`}>
                <div className="bot-left">
                    <video
                        ref={videoRef}
                        playsInline
                        style={{
                            display: isVideoStreamed ? 'block' : 'none',
                        }}
                    >
                        <track kind="captions" />
                    </video>

                    {!isVideoStreamed && (
                        <div className="initial-placeholder">
                            <Image className="circular-placeholder" src={DrE} alt="Circular Placeholder" />
                            <div className="circular-placeholder-overlay">
                                {status === 'disconnected' ? (
                                    <Button
                                        label={<Typography type="p3" text={connectionEstablished || isLoading ? 'Connecting…' : 'Call with Dr. E'} as="span" weight="light" />}
                                        backgroundColor="white"
                                        onClick={handleStart}
                                        leftIcon={Voice}
                                        backgroundColorOnHover="whitesmoke"
                                        id="start"
                                        disable={connectionEstablished || isLoading}
                                    />
                                ) : (
                                    <Button
                                        label={<Typography type="p3" text={isSpeaking ? 'Talk to Interrupt' : 'Listening…'} as="span" weight="light" />}
                                        backgroundColor="white"
                                        leftIcon={Voice}
                                        disabled
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {isVideoStreamed && (
                    <div className="actions">
                        <div className="action-icons">
                            <Button label="" backgroundColor="#651C18" onClick={handleStop} leftIcon={Disconnect} backgroundColorOnHover="red" id="disconnect-btn" />
                        </div>
                        <div className="action-icons">
                            <Button label="" backgroundColor={'#333537'} onClick={handleMute} leftIcon={!muteMic ? Unmute : Mute} backgroundColorOnHover="gray" id="mute-btn" />
                        </div>
                    </div>
                )}
            </section>
            <MemoizedChatBox
                messages={messages}
                isWindowOpen={!!isVideoStreamed}
                onMessage={message => {
                    handleTextMessages(message);
                }}
            />
        </>
    );
};
