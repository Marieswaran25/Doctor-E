import './navbar.scss';

import React from 'react';
import Logo from '@assets/icons/logo.webp';
import { ROUTES } from '@constants/routes';
import { View } from '@library/View';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
    return (
        <nav className="navbar">
            <View className="navbar-container">
                <Link href={ROUTES.HOME}>
                    {' '}
                    <Image src={Logo} alt="logo" width={40} height={40} />
                </Link>
            </View>
        </nav>
    );
};
