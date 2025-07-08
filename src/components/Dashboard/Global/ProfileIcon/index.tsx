import './profileIcon.scss';

import React from 'react';
import { useAuthContext } from '@hooks/logic/authContext';
import { FallbackLine } from '@library/FallbackLine';
import Typography from '@library/Typography';
import Image from 'next/image';

export const ProfileIcon: React.FC<{ width?: string; height?: string }> = ({ width = '40px', height = '40px' }) => {
    const { profile, isLoading } = useAuthContext();
    return (
        <div className="profileIcon" style={{ width, height }}>
            {isLoading || !profile ? (
                <FallbackLine containerStyle={{}} lineStyle={{}} className="profile-icon-loader" />
            ) : profile?.profileUrl ? (
                <Image src={profile.profileUrl} alt="profile" width={40} height={40} />
            ) : (
                <Typography type="p1" weight="light" text={profile?.username?.charAt(0)} color="white" as="span" />
            )}
        </div>
    );
};
