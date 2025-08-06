'use client';
import './interactiveAvatar.scss';

import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Disconnect from '@assets/icons/disconnect.svg';
import DrE from '@assets/icons/drE.webp';
import Unmute from '@assets/icons/mic.svg';
import Mute from '@assets/icons/mutedMic.svg';
import Voice from '@assets/icons/voice.svg';
import { DefaultPrompts } from '@components/Dashboard/InteractiveAvatar/DefaultPrompts';
import { DynamicUpload } from '@components/Dashboard/InteractiveAvatar/DynamicUpload';
import { EndCallNotification } from '@components/Dashboard/InteractiveAvatar/EndCallNotification';
import { useConversation } from '@elevenlabs/react';
import { getAudioStream } from '@helpers/getMediaStream';
import { AvatarQuality, StartAvatarRequest, VoiceChatTransport } from '@heygen/streaming-avatar';
import { StreamingAvatarSessionState, useInterrupt, useStreamingAvatarSession, useVoiceChat } from '@hooks/interactive-avatar';
import { useStreamingAvatarContext } from '@hooks/interactive-avatar/context';
import { useDashboardSettings } from '@hooks/interactive-avatar/dashboardContext';
import { useInteractiveAvatarContext } from '@hooks/interactive-avatar/interactiveAvatarContext';
import { useConversationMessages } from '@hooks/interactive-avatar/useConversationMessage';
import { useTextChat } from '@hooks/interactive-avatar/useTextChat';
import { Button } from '@library/Button';
import { Modal } from '@library/Modal';
import Typography from '@library/Typography';
import { createHeygenToken } from '@services/api/createHeygenToken';
import { generateReportPdf } from '@services/api/generateReportPdf';
import { closeSession, createSession } from '@services/api/sessions';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { CONVO_AGENT_ID, HEYGEN_AVATAR_ID } from '@/config';

import { MemoizedChatBox } from './MemoizedChatbox';

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

export const InteractiveAvatar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [muteMic, setMuteMic] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hegenToken = useRef<string | null>(null);
    const sessionId = useRef<string | null>(null);
    const conversationId = useRef<string | null>(null);

    const [connectionEstablished, setConnectionEstablished] = useState(false);
    const { conversationMessages: messages, setConversationMessages: setMessages } = useConversationMessages();
    const [isLoading, startTrxn] = useTransition();
    const [isEndCallLoading, startEndCallTrxn] = useTransition();
    const queryClient = useQueryClient();

    const { avatarRef, stream, startAvatar, stopAvatar, sessionState, sessionId: videoSessionId } = useStreamingAvatarSession();
    const { interrupt } = useInterrupt();
    const { startVoiceChat, stopVoiceChat, muteInputAudio, unmuteInputAudio } = useVoiceChat();
    const { isAvatarTalking } = useStreamingAvatarContext();
    const { repeatMessageSync } = useTextChat();
    const { setStreamed, isUploadDialogBoxopen, cleanUpCommonContext, diagnosis, setDiagnosis, isTranscriptionOpen } = useInteractiveAvatarContext();
    const [isThinking, setIsThinking] = useState(false);
    const [endCallAlert, setEndCallAlert] = useState(false);
    const [isDownloading, startDownloadTrxn] = useTransition();
    const { setActiveSidebar, clearSettings } = useDashboardSettings();

    useEffect(() => {
        (async () => {
            try {
                if (!hegenToken.current) {
                    hegenToken.current = await createHeygenToken();
                }
            } catch (err: any) {
                console.error('Token prefetch failed', err);
            }
        })();
    }, []);

    const conversations = useConversation({
        micMuted: muteMic,
        onConnect: async id => {
            conversationId.current = id.conversationId;
        },
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
            setMessages(prev => [
                ...prev,
                {
                    datetime: new Date().toISOString(),
                    ...msg,
                },
            ]);
        },

        onDisconnect: async p => {
            console.log(p);
            try {
                console.log('Disconnecting');
                await stopAvatar();
                console.log('Disconnected');
            } catch {
            } finally {
                if (p.reason !== 'user') {
                    handleStop();
                }
            }
        },
        volume: 0,
        clientTools: {
            set_diagnosis_report: async response => {
                console.log('EXTRACTED', response?.data);
                setDiagnosis({
                    name: '',
                    age: 26,
                    selectedTooth: '',
                    reportType: 'x-ray',
                    response: response?.data,
                    image: '',
                });
            },
        },
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
                await handleStop();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream]);

    const handleStart = () => {
        startTrxn(async () => {
            setActiveSidebar(false);
            if (status === 'connected') {
                try {
                    await conversations.endSession();
                } catch {}
            }

            if (sessionState === StreamingAvatarSessionState.CONNECTED) {
                await stopAvatar();
            }

            try {
                if (!hegenToken.current) {
                    hegenToken.current = await createHeygenToken();
                }
                const { sessionId: newSessionId } = await startAvatar(DEFAULT_CONFIG, hegenToken.current);

                setConnectionEstablished(true);

                await getAudioStream();
                await startVoiceChat(!muteMic);

                const [_, session] = await Promise.all([conversations.startSession({ agentId: CONVO_AGENT_ID }), createSession({ externalSessionId: newSessionId || '' })]);
                sessionId.current = session.sessionId;
                setStreamed(true);
                toast.success('Connected');
            } catch (err: any) {
                toast.error(err?.message || 'Failed to start session');
                setConnectionEstablished(false);
                clearSettings();
                avatarRef.current = null;
            } finally {
                document.body.classList.add('overflow-hidden');
                setActiveSidebar(false);
            }
        });
    };
    const handleStop = useCallback(() => {
        setConnectionEstablished(false);
        startEndCallTrxn(async () => {
            try {
                setMessages([]);
                await Promise.all([conversations.endSession(), stopAvatar()]);
            } catch (err) {
                toast.error('Failed to stop session');
            } finally {
                if (sessionId.current && conversationId.current) {
                    await closeSession({ sessionId: sessionId.current, externalConversationId: conversationId.current || '', message: messages.filter(m => !m.attachments) });
                    sessionId.current = null;
                    conversationId.current = null;
                }
                hegenToken.current = null;
                handleEndCancelCall();
                stopVoiceChat();
                document.body.classList.remove('overflow-hidden');
                setMuteMic(false);
                setIsThinking(false);
                cleanUpCommonContext();
                clearSettings();
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
                setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = null;
                    }
                    if (avatarRef.current) {
                        avatarRef.current = null;
                    }
                }, 10);
            }
        });
    }, [
        avatarRef,
        conversations,
        stopAvatar,
        stopVoiceChat,
        handleEndCancelCall,
        cleanUpCommonContext,
        clearSettings,
        setMessages,
        sessionId,
        conversationId,
        messages,
        startEndCallTrxn,
        setIsThinking,
        queryClient,
    ]);

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
        if (isUploadDialogBoxopen) {
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
    }, [isUploadDialogBoxopen, sendContextualUpdate, sendUserActivity]);

    useEffect(() => {
        if (sessionState === StreamingAvatarSessionState.INACTIVE && status === 'connected') {
            try {
                handleStop();
            } catch {}
        }
    }, [sessionState, status, handleStop]);

    const generateDiagnosisReport = useCallback(() => {
        startDownloadTrxn(async () => {
            try {
                if (!diagnosis) return;
                await generateReportPdf({
                    diagnosis: diagnosis?.response?.replaceAll('**', ''),
                    image: diagnosis?.image,
                    reportType: diagnosis?.reportType,
                    selectedTooth: diagnosis?.selectedTooth,
                    age: Number(diagnosis?.age || 25),
                    name: diagnosis?.name || 'N/A',
                });
                setDiagnosis(null);
            } catch (e: any) {
                toast.error(e?.message || 'Failed to generate PDF');
            }
        });
    }, [diagnosis, setDiagnosis]);
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <section className={`voice-chat-bot  ${isTranscriptionOpen && isVideoStreamed ? 'open' : 'close'}`}>
                <div className="bot-left">
                    <Modal style={{ display: isVideoStreamed ? 'flex' : 'none' }} className="avatar-modal">
                        <div className="avatar-video-wrapper">
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
                            {isVideoStreamed && (
                                <div className="actions">
                                    <div className="action-icons">
                                        <Button
                                            label=""
                                            backgroundColor="#651C18"
                                            onClick={() => {
                                                handleEndCall();
                                            }}
                                            leftIcon={Disconnect}
                                            backgroundColorOnHover="red"
                                            id="disconnect-btn"
                                        />
                                    </div>
                                    <div className="action-icons">
                                        <Button label="" backgroundColor={'#333537'} onClick={handleMute} leftIcon={!muteMic ? Unmute : Mute} backgroundColorOnHover="gray" id="mute-btn" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {isVideoStreamed && diagnosis && (
                            <DefaultPrompts
                                prompts={[
                                    {
                                        text: 'Download your diagnosis report',
                                        action: () => {
                                            generateDiagnosisReport();
                                        },
                                        isLoading: isDownloading,
                                    },
                                ]}
                            />
                        )}
                    </Modal>

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
            </section>
            <DynamicUpload
                onMessage={(m, attachments) => {
                    setIsThinking(true);
                    sendUserMessage(m);
                    setMessages(prev => [...prev, { message: m, attachments, source: 'user', datetime: new Date().toLocaleString() }]);
                }}
            />

            <MemoizedChatBox
                isWindowOpen={!!isVideoStreamed}
                onMessage={(m, attachments) => {
                    setIsThinking(true);
                    interrupt();
                    sendUserMessage(m);
                    setMessages(prev => [...prev, { message: m, attachments, source: 'user', datetime: new Date().toLocaleString() }]);
                }}
                onContextualUpdate={m => {
                    sendContextualUpdate(m);
                    sendUserActivity();
                }}
            ></MemoizedChatBox>
            {endCallAlert && (
                <Modal handleModal={handleEndCancelCall} isCloseIcon className="end-call-modal">
                    <EndCallNotification onCancel={handleEndCancelCall} onEndCall={handleStop} isLoading={isEndCallLoading} />
                </Modal>
            )}
            {children}
        </>
    );
};
