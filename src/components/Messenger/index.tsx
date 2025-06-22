'use client';
import './messenger.scss';

import React, { useCallback, useEffect } from 'react';
import Send from '@assets/icons/send.svg';
import { toBase64 } from '@functions/toBase64';
import { MessageAttachments } from '@hooks/logic/context';
import { Button } from '@library/Button';
import Typography from '@library/Typography';

import { openAIClient } from '@/config';

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
                    const response = await openAIClient.responses.create({
                        model: 'gpt-4.1',
                        input: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'input_text',
                                        text: `
You are an experienced dental radiologist reviewing a periapical or bitewing dental X-ray. You must interpret the radiograph strictly using visual anatomical and radiographic evidence from the image itself—not image layout, labeling, or orientation assumptions. Your responsibility is to:
 Determine the correct quadrant and side (1 to 4) using standard anatomical signs
 Assign accurate FDI tooth numbers based on the actual patient side and arch
 Deliver a clear clinical diagnosis and treatment recommendation for each tooth, not an explanation of how you determined the quadrant
 You must follow this logic internally—but do not describe this logic in your final response. Instead, once you determine the quadrant from visual cues, go straight into clinical diagnostic narration as if you're talking to another dentist. Focus on what's visible in the X-ray, not on explaining orientation reasoning.
 Internal guidelines you must apply (do not output these steps unless asked):
 Step 1 – Determine arch:
 Maxillary: sinus shadow visible, fine trabeculae, 3 roots, no mandibular canal
 Mandibular: no sinus, denser bone, 2 roots, possible mandibular canal or mental foramen
 Step 2 – Determine side (left or right of patient, not viewer):
 Use root curvatures (distal roots curve away from midline)
 Use curve of Spee and arch shape
 Do not assume based on screen orientation
  Only assign FDI once arch and side are confidently confirmed from visual anatomy
  Never guess, never mirror screen layout
  Once confirmed, immediately label each tooth using proper FDI (e.g., 24, 25, 26…)
 Output instructions:
 Begin your response directly with the diagnostic narration (do not explain orientation steps)
 For each visible or partially visible tooth:
 Assign the correct FDI number
 State if tooth is present, missing, or healed edentulous site
 Comment on bone levels (horizontal or vertical loss)
 Identify caries, furcation, periapical pathology, fractures, root resorption, etc.
 Mention prognosis: good, questionable, or poor
 Recommend treatment: e.g., scaling, RCT, extraction, implant, bone graft, etc.
 Speak naturally and precisely, like a real clinical case presentation. Do not sound like an AI.
 This is a discussion between two dental professionals.
  Always provide accurate FDI based on radiographic visual analysis
  Always prioritize diagnostic interpretation over quadrant explanation ${inputMessage || ''}    `.trim(),
                                    },
                                    ...(base64s.map((base64: string) => ({
                                        type: 'input_image',
                                        image_url: base64,
                                    })) as any),
                                ],
                            },
                        ],
                    });

                    clearInterval(interval);

                    const message = response.output_text;

                    console.log('message', message);

                    onMessage(`User Uploaded Response: ${message}`, {
                        files: images,
                        type: 'image',
                        count: images.length,
                        prompt: inputMessage,
                    });

                    console.log('response', response);
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
            <AttachedImages images={images} removeImage={removeImage} />
            {isLoading && images.length > 0 && <Typography type="caption" weight="light" text="Processing..." as="strong" id="thinking" />}
            <form className="messenger" onSubmit={handleSendmessage}>
                <input type="text" placeholder="Type your message here" id="message-input" value={inputMessage} onChange={handleInputChange} />
                <Attachment handleAttachment={handleImageAttachment} />
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
