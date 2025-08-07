import './initialGreeting.scss';

import React from 'react';
import { BreadCrumbs } from '@components/BreadCrumbs';
import { Greeting } from '@components/Dashboard/Global/Greeting';
import { View } from '@library/View';

type InitialGreetingProps = {
    items: {
        value: string;
        onClick?: () => void;
    }[];
};

export const InitialGreeting = ({ items }: InitialGreetingProps) => {
    return (
        <View className="initial-greeting">
            <BreadCrumbs items={items} className="dashboard-breadCrumbs" />
            <Greeting />
        </View>
    );
};
