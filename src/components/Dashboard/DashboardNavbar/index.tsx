import './dashboardNavbar.scss';

import React from 'react';
import Menu from '@assets/icons/sidebar/menu.svg';
import { ProfileIcon } from '@components/Dashboard/Global/ProfileIcon';
import { useDashboardSettings } from '@hooks/interactive-avatar/dashboardContext';
import { Button } from '@library/Button';
import { View } from '@library/View';

export const DashboardNavbar = () => {
    const { activeSidebar, setActiveSidebar } = useDashboardSettings();
    return (
        <nav className="dashboard-navbar">
            <View className="navbar-container">
                <Button color="#005b8f" label={''} onClick={() => setActiveSidebar(!activeSidebar)} backgroundColor="transparent" leftIcon={Menu} />

                <div className="end">
                    <ProfileIcon />
                </div>
            </View>
        </nav>
    );
};
