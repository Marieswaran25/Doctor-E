import React from 'react';
import AttachmentIcon from '@assets/icons/attachment.svg';
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
            <AttachmentIcon />
            <input type="file" accept="image/*" multiple id="file-input" onChange={handleInputChange} value={''} />
        </div>
    );
});
Attachment.displayName = 'Attachment';
