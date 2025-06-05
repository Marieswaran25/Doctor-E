'use client';
import './navbar.scss';

import React from 'react';
import Chat from '@assets/icons/chat.svg';
import { useCommonContext } from '@hooks/logic/commonContext';
import Typography from '@library/Typography';
import { View } from '@library/View';

export const Navbar = () => {
    const { setSideBarOpen, sideBarOpen, isStreamed } = useCommonContext();
    return (
        <nav className="navbar">
            <View className="navbar-container">
                <Typography type="h1" weight="semibold" text="DR.E" color="black" as="h1" />
                {isStreamed && <Chat onClick={() => setSideBarOpen(true)} className={`chat-icon`} />}
            </View>
        </nav>
    );
};
