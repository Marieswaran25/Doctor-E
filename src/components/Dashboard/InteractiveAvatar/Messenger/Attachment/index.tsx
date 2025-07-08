import './attachment.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';
import AttachmentIcon from '@assets/icons/attachment.svg';
import Typography from '@library/Typography';
interface AttachmentProps {
    handleAttachment: (file: File[]) => void;
}
export const Attachment: React.FC<AttachmentProps> = React.memo(({ handleAttachment }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files);
            handleAttachment(file);
        }
    };
    return (
        <div className="attachment">
            <div className="title">
                <AttachmentIcon />
                <Typography type="p3" weight="light" text="Browse or drag and drop a file" as="span" color={colors.Gray3} />
            </div>
            <input type="file" accept="image/*" id="file-input" onChange={handleInputChange} value={''} />
        </div>
    );
});
Attachment.displayName = 'Attachment';
