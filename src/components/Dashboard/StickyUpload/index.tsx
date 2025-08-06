'use client';
import './stickyUpload.scss';

import React, { Fragment } from 'react';
import Upload from '@assets/icons/upload.svg';
import { useInteractiveAvatarContext } from '@hooks/logic/interactiveAvatarContext';

export const StickyUpload = () => {
    const { setIsUploadDialogBoxopen, isStreamed } = useInteractiveAvatarContext();
    return (
        <Fragment>
            {isStreamed && (
                <div className="sticky-upload">
                    <Upload onClick={() => setIsUploadDialogBoxopen(true)} className={`upload-icon`} />
                </div>
            )}
        </Fragment>
    );
};
