import './profileIcon.scss';

import React from 'react';
import { useProfile } from '@hooks/useProfile';
import { FallbackLine } from '@library/FallbackLine';
import Tooltip from '@library/Tooltip/tooltip';
import Typography from '@library/Typography';
import Image from 'next/image';

export const ProfileIcon: React.FC<{ width?: string; height?: string }> = ({ width = '40px', height = '40px' }) => {
    const { profile, isLoading } = useProfile();
    return (
        <div className="profileIcon" style={{ width, height }}>
            {isLoading || !profile ? (
                <FallbackLine containerStyle={{}} lineStyle={{}} className="profile-icon-loader" />
            ) : (
                <Tooltip backgroundColor={'#000'} infoText={<Typography type="mini" weight="light" text={profile?.email} color="white" as="p" />} position="right">
                    {profile?.profileUrl ? (
                        <Image src={profile.profileUrl} alt="profile" width={40} height={40} className="profile-icon-image" />
                    ) : (
                        <Typography type="p1" weight="light" text={(profile?.username || profile?.email)?.charAt(0)?.toUpperCase()} color="white" as="span" className="profile-icon-text" />
                    )}
                </Tooltip>
            )}
        </div>
    );
};
