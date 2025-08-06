import './endCallNotification.scss';

import React from 'react';
import { Button } from '@library/Button';
import Typography from '@library/Typography';

type EndCallNotificationProps = {
    onCancel: () => void;
    onEndCall: () => void;
    isLoading?: boolean;
};

export const EndCallNotification: React.FC<EndCallNotificationProps> = ({ isLoading, onCancel, onEndCall }) => {
    return (
        <div className="end-call-notification">
            <Typography type="p3" weight="regular" text="Would you like to end the call now?" color="gray" as="p" />
            <div className="button-wrapper">
                <Button label={<Typography type="caption" text={'Cancel'} as="span" weight="light" />} onClick={onCancel} id="cancel-call" />
                <Button
                    label={<Typography type="caption" text={'End now'} as="span" weight="light" color="white" />}
                    backgroundColor="red"
                    onClick={onEndCall}
                    backgroundColorOnHover="red"
                    id="end-call"
                    isLoading={isLoading}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};
