'use client';
import './caller.scss';

import React from 'react';
import Mic from '@assets/icons/mic.svg';
import Muted from '@assets/icons/mutedMic.svg';
import { ProfileIcon } from '@components/Dashboard/Global/ProfileIcon';
import { useProfile } from '@hooks/useProfile';
import Typography from '@library/Typography';
import Image from 'next/image';

export const Caller = ({ isSpeaking }: { isSpeaking: boolean }) => {
    const { profile } = useProfile();
    return (
        <div className="caller">
            <div className="caller-container">
                {!isSpeaking ? <Mic /> : <Muted />}
                <ProfileIcon width="50px" height="50px" />
                {profile?.username && <Typography type="p3" weight="light" text={`${profile.username}...`} color="white" as="span" />}
            </div>
        </div>
    );
};
