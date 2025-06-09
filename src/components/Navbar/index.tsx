import './navbar.scss';

import React from 'react';
import Logo from '@assets/icons/logo.png';
import { View } from '@library/View';
import Image from 'next/image';

export const Navbar = () => {
    return (
        <nav className="navbar">
            <View className="navbar-container">
                <Image src={Logo} alt="logo" width={40} height={40} />
            </View>
        </nav>
    );
};
