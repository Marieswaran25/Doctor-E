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
import { DynamicUpload } from '@components/DynamicUpload';
import { EndCallNotification } from '@components/EndCallNotification';
import { useConversation } from '@elevenlabs/react';
import { getAudioStream } from '@helpers/getMediaStream';
import { AvatarQuality, StartAvatarRequest, VoiceChatTransport } from '@heygen/streaming-avatar';
import { StreamingAvatarSessionState, useInterrupt, useStreamingAvatarSession, useVoiceChat } from '@hooks/logic';
import { useCommonContext } from '@hooks/logic/commonContext';
import { MessageAttachments, useStreamingAvatarContext } from '@hooks/logic/context';
import { useConversationMessages } from '@hooks/logic/useConversationMessage';
import { useTextChat } from '@hooks/logic/useTextChat';
import { Button } from '@library/Button';
import { Modal } from '@library/Modal';
import Typography from '@library/Typography';
import { createHeygenToken } from '@services/api/createHeygenToken';
import Image from 'next/image';

import { CONVO_AGENT_ID, HEYGEN_AVATAR_ID } from '@/config';
// import { DefaultPrompts } from '@components/DefaultPrompts';

const DEFAULT_CONFIG: StartAvatarRequest = {
    quality: AvatarQuality.High,
    avatarName: HEYGEN_AVATAR_ID,
    language: 'en',
    voiceChatTransport: VoiceChatTransport.WEBSOCKET,
    voice: {
        elevenlabsSettings: {
            similarity_boost: 1,
            stability: 0.2,
        },
    },
};

// const DEFAULT_PROMPTS: string[] = [
//     'Can you explain common dental issues to me?',
//     'Can you explain dental implants to me?',
//     'Can you explain dental care to me?',
// ]

const MemoizedChatBox = React.memo(
    ({
        isWindowOpen,
        children,
        onMessage,
        onContextualUpdate,
    }: {
        isWindowOpen: boolean;
        children?: React.ReactNode;
        onContextualUpdate: (m: string) => void;
        onMessage: (message: string, attachments?: MessageAttachments) => void;
    }) => {
        return (
            <Chatbox isWindowOpen={isWindowOpen} onMessage={onMessage} onContextualUpdate={onContextualUpdate}>
                {children}
            </Chatbox>
        );
    },
);
MemoizedChatBox.displayName = 'MemoizedChatBox';

export const VoiceChatBot: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [muteMic, setMuteMic] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { sideBarOpen } = useCommonContext();

    const [connectionEstablished, setConnectionEstablished] = useState(false);
    const { conversationMessages: messages, setConversationMessages: setMessages } = useConversationMessages();
    const [isLoading, startTrxn] = useTransition();

    const { avatarRef, stream, startAvatar, stopAvatar, sessionState } = useStreamingAvatarSession();
    const { interrupt } = useInterrupt();
    const { startVoiceChat, stopVoiceChat, muteInputAudio, unmuteInputAudio } = useVoiceChat();
    const { isAvatarTalking } = useStreamingAvatarContext();
    const { repeatMessageSync } = useTextChat();
    const { setSideBarOpen, setStreamed, isUploadOpen, setUploadOpen } = useCommonContext();
    const [isThinking, setIsThinking] = useState(false);
    const [endCallAlert, setEndCallAlert] = useState(false);

    const conversations = useConversation({
        micMuted: muteMic,
        onError: msg => console.error('[Error]', msg),
        onMessage: async msg => {
            if (msg.source === 'ai' && avatarRef.current) {
                try {
                    if (!isThinking) setIsThinking(true);
                    await repeatMessageSync(msg.message);
                    setIsThinking(false);
                } catch (e: any) {
                    toast.error(e?.message || 'Failed to connect');
                }
            } else {
                setIsThinking(true);
                interrupt();
            }
            setMessages(prev => [...prev, msg]);
        },
        onDisconnect: async () => {
            try {
                console.log('Disconnecting');
                await stopAvatar();
                console.log('Disconnected');
            } catch {
            } finally {
                handleEndCancelCall();
                setSideBarOpen(false);
                setMessages([]);
                stopVoiceChat();
                setStreamed(false);
                setMuteMic(false);
                setIsThinking(false);
                setUploadOpen(false);
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

    const { status, isSpeaking, sendUserMessage, sendContextualUpdate, sendUserActivity } = conversations;

    const isVideoStreamed = useMemo(() => {
        return avatarRef.current && status === 'connected' && connectionEstablished;
    }, [avatarRef, status, connectionEstablished]);

    const handleEndCall = useCallback(() => {
        setEndCallAlert(true);
    }, []);

    const handleEndCancelCall = useCallback(() => {
        setEndCallAlert(false);
    }, []);

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
                await startAvatar(DEFAULT_CONFIG, token);
                setConnectionEstablished(true);

                await getAudioStream();
                await startVoiceChat(!muteMic);

                await conversations.startSession({ agentId: CONVO_AGENT_ID });
                setStreamed(true);
                toast.success('Connected');
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
            handleEndCancelCall();
            setSideBarOpen(false);
            setMuteMic(false);
            setIsThinking(false);
            setMessages([]);
            stopVoiceChat();
            setStreamed(false);
            setUploadOpen(false);
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

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isUploadOpen) {
            interval = setInterval(() => {
                sendContextualUpdate('User uploading image, please wait.');
                sendUserActivity();
            }, 5000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isUploadOpen, sendContextualUpdate, sendUserActivity]);

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

                    {isVideoStreamed && (
                        <div className="status-wrapper">
                            {<div style={{ backgroundColor: isAvatarTalking ? 'green' : isThinking ? 'orange' : 'red' }} className="status-dot" />}
                            {<Typography type={'caption'} weight={'light'} text={isAvatarTalking ? 'Speaking...' : isThinking ? 'Thinking...' : 'Listening...'} as="p" color="black" />}
                        </div>
                    )}

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
                            <Button label="" backgroundColor="#651C18" onClick={handleEndCall} leftIcon={Disconnect} backgroundColorOnHover="red" id="disconnect-btn" />
                        </div>
                        <div className="action-icons">
                            <Button label="" backgroundColor={'#333537'} onClick={handleMute} leftIcon={!muteMic ? Unmute : Mute} backgroundColorOnHover="gray" id="mute-btn" />
                        </div>
                    </div>
                )}
            </section>
            <DynamicUpload
                onMessage={(m, attachments) => {
                    setIsThinking(true);
                    sendUserMessage(m);
                    setMessages(prev => [...prev, { message: m, attachments, source: 'user' }]);
                }}
            />

            <MemoizedChatBox
                isWindowOpen={!!isVideoStreamed}
                onMessage={(m, attachments) => {
                    setIsThinking(true);
                    interrupt();
                    sendUserMessage(m);
                    setMessages(prev => [...prev, { message: m, attachments, source: 'user' }]);
                }}
                onContextualUpdate={m => {
                    sendContextualUpdate(m);
                    sendUserActivity();
                }}
            ></MemoizedChatBox>
            {endCallAlert && (
                <Modal handleModal={handleEndCancelCall} isCloseIcon className="end-call-modal">
                    <EndCallNotification onCancel={handleEndCancelCall} onEndCall={handleStop} />
                </Modal>
            )}
            {children}
        </>
    );
};
