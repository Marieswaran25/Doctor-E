'use client';
import './messenger.scss';

import React, { useCallback, useEffect } from 'react';
import Send from '@assets/icons/send.svg';
import { toBase64 } from '@functions/toBase64';
import { MessageAttachments } from '@hooks/interactive-avatar/context';
import { Button } from '@library/Button';
import Typography from '@library/Typography';
import OpenAI from 'openai';

import { OPEN_AI_KEY } from '@/config';

import { AttachedImages } from './AttachedImages';
import { Attachment } from './Attachment';

export const Messenger = React.memo(({ onMessage, onContextualUpdate }: { onContextualUpdate: (message: string) => void; onMessage: (message: string, attachments?: MessageAttachments) => void }) => {
    const [inputMessage, setInputMessage] = React.useState('');
    const [images, setImages] = React.useState<File[]>([]);
    const [isLoading, startTransaction] = React.useTransition();

    useEffect(() => {
        return () => {
            setImages([]);
            setInputMessage('');
        };
    }, []);

    const handleSendmessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let interval: NodeJS.Timeout | null = null;
        startTransaction(async () => {
            if (images.length > 0) {
                try {
                    interval = setInterval(() => {
                        onContextualUpdate('User uploading image, please wait.');
                    }, 5000);
                    const base64s = await Promise.all(images.map((image: File) => toBase64(image)));
                    const openAIClient = new OpenAI({
                        apiKey: OPEN_AI_KEY,
                        dangerouslyAllowBrowser: true,
                    });

                    const response = await openAIClient.chat.completions.create({
                        model: 'gpt-4-vision-preview',
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: `
                                        You are an experienced dentist. This is X ray periapical showing lower left side/ sector 3 of FDI, We see the presence of 34, 35, the premolars 36, and partially 37. Can you provide detailed diagnosis as if you are talking to a colleague without missing any details?`.trim(),
                                    },
                                    ...(base64s.map((base64: string) => ({
                                        type: 'input_url',
                                        image_url: { url: base64 },
                                    })) as any),
                                ],
                            },
                        ],
                    });

                    clearInterval(interval);

                    const message = response?.choices[0]?.message?.content;

                    console.log('message', message);

                    onMessage(`User Uploaded Response: ${message}`, {
                        files: images,
                        type: 'image',
                        count: images.length,
                        prompt: inputMessage,
                    });
                } catch (err: any) {
                    console.log('err', err);
                } finally {
                    if (interval) {
                        clearInterval(interval);
                    }
                    setTimeout(() => {
                        setInputMessage('');
                    }, 1000);
                    if (images.length > 0) {
                        setImages([]);
                    }
                }
            } else {
                if (!inputMessage.length) {
                    return;
                }
                onMessage(inputMessage);
                setInputMessage('');
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    const handleImageAttachment = (file: File[]) => {
        setImages(prev => [...prev, ...(Array.isArray(file) ? file : [file])]);
    };

    const removeImage = useCallback((index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    }, []);
    return (
        <>
            {/* <AttachedImages images={images} removeImage={removeImage} /> */}
            {isLoading && images.length > 0 && <Typography type="caption" weight="light" text="Processing..." as="strong" id="thinking" />}
            <form className="messenger" onSubmit={handleSendmessage}>
                <input type="text" placeholder="Type your message here" id="message-input" value={inputMessage} onChange={handleInputChange} />
                {/* <Attachment handleAttachment={handleImageAttachment} /> */}
                <Button
                    label=""
                    backgroundColor={'#658192'}
                    leftIcon={Send}
                    backgroundColorOnHover={'#254156'}
                    id="send-btn"
                    type="submit"
                    isLoading={isLoading}
                    disable={isLoading}
                    disabled={isLoading}
                />
            </form>
        </>
    );
});

Messenger.displayName = 'Messenger';
