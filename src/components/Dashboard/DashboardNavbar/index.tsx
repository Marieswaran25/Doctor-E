import './dashboardNavbar.scss';

import React from 'react';
import Logo from '@assets/icons/logo2.png';
import Menu from '@assets/icons/sidebar/menu.svg';
import { ProfileIcon } from '@components/Dashboard/Global/ProfileIcon';
import { useDashboardSettings } from '@hooks/contexts/dashboardContext';
import { Button } from '@library/Button';
import { View } from '@library/View';
import Image from 'next/image';
export const DashboardNavbar = () => {
    const { activeSidebar, setActiveSidebar } = useDashboardSettings();
    return (
        <nav className="dashboard-navbar">
            <View className="navbar-container">
                <Button color="#005b8f" label={''} onClick={() => setActiveSidebar(!activeSidebar)} backgroundColor="transparent" leftIcon={Menu} />
                <div className="center">
                    <Image src={Logo} alt="Logo" width={55} height={55} />
                </div>
                <div className="end">
                    <ProfileIcon />
                </div>
            </View>
        </nav>
    );
};
