'use client';
import React from 'react';
import { NavigationMenuItems } from '@components/Dashboard/NavigationMenuItems';
import { View } from '@library/View';

export default function Dashboard() {
    return (
        <View className="dashboard-main-container" style={{ paddingTop: '1.5rem', paddingBottom: '0rem' }}>
            <NavigationMenuItems />
        </View>
    );
}
