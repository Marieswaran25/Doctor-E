'use client';
import './stickyUpload.scss';

import React, { Fragment } from 'react';
import Upload from '@assets/icons/upload.svg';
import { useCommonContext } from '@hooks/logic/commonContext';

export const StickyUpload = () => {
    const { setUploadOpen, isStreamed } = useCommonContext();
    return (
        <Fragment>
            {isStreamed && (
                <div className="sticky-upload">
                    <Upload onClick={() => setUploadOpen(true)} className={`upload-icon`} />
                </div>
            )}
        </Fragment>
    );
};
