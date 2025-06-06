'use client';
import './navbar.scss';

import React from 'react';
import Chat from '@assets/icons/chat.svg';
import Logo from '@assets/icons/logo.png';
import { useCommonContext } from '@hooks/logic/commonContext';
import { View } from '@library/View';
import Image from 'next/image';

export const Navbar = () => {
    const { setSideBarOpen, isStreamed } = useCommonContext();
    return (
        <nav className="navbar">
            <View className="navbar-container">
                <Image src={Logo} alt="logo" width={40} height={40} />
                {isStreamed && <Chat onClick={() => setSideBarOpen(true)} className={`chat-icon`} />}
            </View>
        </nav>
    );
};
