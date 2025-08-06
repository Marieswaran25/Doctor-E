'use client';
import './dynamicUpload.scss';
import colors from '@theme/colors.module.scss';

import React, { Fragment, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { AttachedImages } from '@components/Dashboard/InteractiveAvatar/Messenger/AttachedImages';
import { Attachment } from '@components/Dashboard/InteractiveAvatar/Messenger/Attachment';
import { toBase64 } from '@functions/toBase64';
import { yupResolver } from '@hookform/resolvers/yup';
import { MessageAttachments } from '@hooks/interactive-avatar/context';
import { useInteractiveAvatarContext } from '@hooks/interactive-avatar/interactiveAvatarContext';
import { Button } from '@library/Button';
import { CustomCheckBox } from '@library/CustomCheckBox';
import CustomInput from '@library/CustomInput';
import { Modal } from '@library/Modal';
import Typography from '@library/Typography';
import { uploadFieldSchema } from '@utils/schema';
import OpenAI from 'openai';

import { OPEN_AI_KEY } from '@/config';

import { ToothPositioning } from './ToothPositioning';

type DynamicUploadProps = {
    onMessage: (message: string, attachments?: MessageAttachments) => void;
};

export const DynamicUpload: React.FC<DynamicUploadProps> = ({ onMessage }) => {
    const { isUploadDialogBoxopen, setIsUploadDialogBoxopen, setDiagnosis } = useInteractiveAvatarContext();
    const [isLoading, startTransaction] = useTransition();
    const [images, setImages] = React.useState<File[]>([]);

    const {
        resetField,
        register,
        setError,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(uploadFieldSchema),
        mode: 'onChange',
        shouldFocusError: false,
        defaultValues: {},
    });

    const handleImageAttachment = useCallback((file: File[]) => {
        setImages(prev => [...prev, ...(Array.isArray(file) ? file : [file])]);
    }, []);

    const removeImage = useCallback((index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    }, []);
    const uploadField = watch();

    const handleSendmessage = handleSubmit(data => {
        startTransaction(async () => {
            if (images.length > 0) {
                try {
                    const base64s = await Promise.all(images.map((image: File) => toBase64(image)));
                    const openAIClient = new OpenAI({
                        apiKey: OPEN_AI_KEY,
                        dangerouslyAllowBrowser: true,
                    });

                    const imageText = `You are Dr. E, a board-certified dental radiologist AI with full access to the clinical knowledge base at https://doctor-e-book.vercel.app/. 
When given only a clinical photograph of the patient's teeth (no radiographs, no tooth numbers), you must output exactly three lines, each formatted as:

**<Heading>: I note <5–8-word observation>.**

Where:
- **Heading** is one key clinical finding or treatment category visible in the photo (e.g., Micro-Veneers; Alignment & Spacing; Gingival Health; Perio & Infections; Ceramic Restorations; Bruxism; Hygiene Need; Healed Edentulous Site).
- The observation is a natural‐sounding physician comment beginning with "I note" or "I observe," and is 5–8 words long.

Rules:
- Use professional, conversational phrasing as a real doctor would speak.
- Always include any visible restored or edentulous sites if they're among the top findings.
- Do **not** include tooth numbers, radiographic details, treatment steps, or any extra narrative.
- Keep each line focused, clear, and empathetic—just like a brief consult note.`;

                    const xRayText = `
                                            You are Dr. E, a board-certified dental radiologist AI specialized in interpreting dental imaging (periapical, bitewing, panoramic, CBCT). When provided with a scan, produce a concise, natural, clinical diagnostic narrative exactly as an experienced specialist would verbally report it.

access to the dental knowledge repository at: https://doctor-e-book.vercel.app/
Begin by clearly stating the anatomical region (e.g., "lower right quadrant") and listing the teeth visible using the provided numbering system.

Each tooth or edentulous site must be individually described, addressing the following clinical aspects naturally within your discussion:
 • Clearly mention the tooth number provided by the user.
 • Indicate the tooth status as present, extracted, or a healed edentulous site.
 • Describe bone levels around each tooth in detail, mentioning if they are normal or if there is horizontal or vertical bone loss, including the severity when applicable.
 • Note clearly any observed pathology such as dental caries, apical lesions, furcation involvement, root resorption, fractures, or any other relevant radiographic findings.
 • Provide your professional prognosis for each tooth or site as good, questionable, or poor, and include a brief clinical rationale.

This is the user provided input: patient name - ${data.name || 'N/A'}, patient age - ${data.age}, xray type - ${data.xray}, notation - ${data.notation}, tooth position - ${data.selectedTooths?.sort().join(', ')}
Never omit edentulous or extracted sites. Always mention their tooth numbering clearly as given by the user and discuss the clinical condition of these areas comprehensively, including bone quality and potential for future implant placement or prosthetic rehabilitation when relevant.

Do NOT provide treatment recommendations deliver only the diagnostic findings, prognosis, and clinical rationales as a concise, natural-sounding professional statement, avoiding technical methods, citations, or bullet points beyond the structure above.
    }    `.trim();

                    const response = await openAIClient.responses.create({
                        model: data.model === 'Advance' ? 'o3' : 'gpt-4.1',
                        input: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'input_text',
                                        text: data.type === 'XRay' ? xRayText : imageText,
                                    },
                                    ...(base64s.map((base64: string) => ({
                                        type: 'input_image',
                                        image_url: base64,
                                    })) as any),
                                ],
                            },
                        ],
                    });

                    const message = response.output_text;

                    console.log('message', message);

                    onMessage(`User Uploaded Response: ${message}`, {
                        files: images,
                        type: 'image',
                        count: images.length,
                        prompt: '',
                    });
                    setDiagnosis({
                        age: Number(data.age || 25),
                        name: data.name || 'John Doe',
                        response: message,
                        reportType: data.type,
                        image: base64s[0],
                        selectedTooth: data.selectedTooths ? data.selectedTooths?.sort().join(', ') : '',
                    });

                    console.log('response', response);
                } catch (err: any) {
                    console.log('err', err);
                } finally {
                    if (images.length > 0) {
                        setImages([]);
                    }
                    reset();
                    setIsUploadDialogBoxopen(false);
                }
            } else {
                setError('root', { message: 'Please attach a report' });
                return;
            }
            return;
        });
    });
    return (
        <Fragment>
            {isUploadDialogBoxopen && (
                <Modal
                    handleModal={() => {
                        setIsUploadDialogBoxopen(false);
                        reset();
                        setImages([]);
                    }}
                    isCloseIcon
                >
                    <form onSubmit={handleSendmessage} className="dynamic-upload-container">
                        <Typography type="p1" weight="regular" text="Diagnostic Report" color={colors.Gray3} as="h3" />

                        <div className="report">
                            <Typography type="p3" weight="regular" text="Attach a report" color={colors.Gray3} as="p" />
                            {Array.isArray(images) && images.length > 0 ? <AttachedImages images={images} removeImage={removeImage} /> : <Attachment handleAttachment={handleImageAttachment} />}
                            {errors.root?.message && images.length === 0 && <Typography type="caption" weight="regular" text={errors.root.message} color={'red'} as="p" />}
                        </div>
                        <div className="outer">
                            <div className="left">
                                <div className="info">
                                    <CustomInput
                                        type="text"
                                        placeholder="Enter the patient's name"
                                        label="Name"
                                        inputMode="text"
                                        labelStyle={{ color: colors.Gray3 }}
                                        isRequired
                                        {...register('name')}
                                        error={errors?.name?.message}
                                        groupClass={errors?.name?.message ? 'error' : ''}
                                    />
                                    <CustomInput
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="Enter the patient's age"
                                        label="Age"
                                        isRequired
                                        labelStyle={{ color: colors.Gray3 }}
                                        min={1}
                                        max={99}
                                        maxLength={2}
                                        {...register('age')}
                                        error={errors?.age?.message}
                                        groupClass={errors?.age?.message ? 'error' : ''}
                                    />
                                </div>
                                <div className="type">
                                    <CustomCheckBox
                                        isRequired
                                        options={[
                                            { label: 'Photo', value: 'Image' },
                                            { label: 'X-Ray', value: 'XRay' },
                                            { label: 'CBCT', value: 'CBCT' },
                                        ]}
                                        {...register('type', {
                                            onChange: () => {
                                                resetField('xray');
                                                resetField('notation');
                                                resetField('selectedTooths');
                                                resetField('cbct');
                                            },
                                        })}
                                        style={{
                                            minWidth: '66px',
                                        }}
                                        label="type"
                                        labelElement={<Typography type="p3" weight="regular" text="Type" color={colors.Gray3} as="p" />}
                                        checkedValues={Array.isArray(uploadField.type) && uploadField.type.length > 0 ? uploadField.type : [uploadField.type]}
                                        allowOne
                                        error={errors.type?.message}
                                    />
                                </div>

                                {uploadField.type === 'XRay' && (
                                    <div className="xray">
                                        <CustomCheckBox
                                            isRequired
                                            options={[
                                                { label: 'Periapical', value: 'Periapical' },
                                                { label: 'Bitewing', value: 'Bitewing' },
                                                { label: 'Panoramic', value: 'Panoramic' },
                                            ]}
                                            {...register('xray')}
                                            label="xray"
                                            labelElement={<Typography type="p3" weight="regular" text="X-Ray" color={colors.Gray3} as="p" />}
                                            style={{
                                                minWidth: '66px',
                                            }}
                                            checkedValues={Array.isArray(uploadField.xray) && uploadField.xray.length > 0 ? uploadField.xray : [uploadField.xray || '']}
                                            allowOne
                                            error={errors.xray?.message}
                                        />
                                    </div>
                                )}

                                {uploadField.type === 'CBCT' && (
                                    <div className="xray">
                                        <CustomCheckBox
                                            isRequired
                                            options={[
                                                { label: 'Upper', value: 'Upper' },
                                                { label: 'Lower', value: 'Lower' },
                                                { label: 'Both', value: 'Both' },
                                            ]}
                                            {...register('cbct', {})}
                                            label="cbct"
                                            labelElement={<Typography type="p3" weight="regular" text="CBCT" color={colors.Gray3} as="p" />}
                                            style={{
                                                minWidth: '66px',
                                            }}
                                            checkedValues={Array.isArray(uploadField.cbct) && uploadField.cbct.length > 0 ? uploadField.cbct : [uploadField.cbct || '']}
                                            allowOne
                                            error={errors.xray?.message}
                                        />
                                    </div>
                                )}
                                {uploadField.type === 'XRay' && (
                                    <div className="notation">
                                        <CustomCheckBox
                                            isRequired
                                            options={[
                                                { label: 'FDI', value: 'FDI' },
                                                { label: 'Universal (UTN)', value: 'Universal' },
                                            ]}
                                            {...register('notation', {
                                                onChange: () => {
                                                    resetField('selectedTooths');
                                                },
                                            })}
                                            label="notation"
                                            labelElement={<Typography type="p3" weight="regular" text="Notation" color={colors.Gray3} as="p" />}
                                            style={{
                                                minWidth: '66px',
                                            }}
                                            checkedValues={Array.isArray(uploadField.notation) && uploadField.notation.length > 0 ? uploadField.notation : [uploadField.notation || '']}
                                            allowOne
                                            error={errors.notation?.message}
                                        />
                                    </div>
                                )}
                                {uploadField.type === 'XRay' && uploadField.notation && (
                                    <div className={`selection `}>
                                        <Typography type="p3" weight="regular" text="Select Teeth" color={colors.Gray3} as="p" />
                                        <ToothPositioning
                                            error={errors.selectedTooths?.message}
                                            {...register('selectedTooths')}
                                            selectedTooths={(Array.isArray(uploadField.selectedTooths) && (uploadField.selectedTooths?.filter(Boolean) as string[])) || []}
                                            notation={uploadField.notation || 'Universal'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="report-type">
                            <CustomCheckBox
                                options={[
                                    { label: 'Basic', value: 'Basic' },
                                    { label: 'Detailed', value: 'Advance' },
                                ]}
                                isRequired
                                style={{
                                    minWidth: '66px',
                                }}
                                {...register('model')}
                                label=" Diagnosis Preference"
                                labelElement={<Typography type="p3" weight="regular" text=" Diagnosis Preference" color={colors.Gray3} as="p" />}
                                checkedValues={Array.isArray(uploadField.model) && uploadField.model.length > 0 ? uploadField.model : [uploadField.model || '']}
                                allowOne
                                error={errors.model?.message}
                            />
                        </div>
                        <Button
                            label={<Typography type="p3" weight="regular" text={isLoading ? 'Analyzing...' : 'Analyze'} color="white" />}
                            buttonType="primary"
                            id="upload-btn"
                            type="submit"
                            backgroundColor={colors.Gray2}
                            backgroundColorOnHover={colors.Gray3}
                            disabled={isLoading}
                        />
                    </form>
                </Modal>
            )}
        </Fragment>
    );
};
