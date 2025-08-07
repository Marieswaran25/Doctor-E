import './navigationMenuItems.scss';
import colors from '@theme/colors.module.scss';

import React, { useMemo } from 'react';
import DrE from '@assets/icons/drE.webp';
import ChatHistory from '@assets/images/Dashboard/menu/chatHistory.webp';
import DentalEducation from '@assets/images/Dashboard/menu/dentalEducation.webp';
import DigitalPlanning from '@assets/images/Dashboard/menu/digitalPlanning.webp';
import InstantDiagnosis from '@assets/images/Dashboard/menu/instantDiagnosis.webp';
import LabServices from '@assets/images/Dashboard/menu/labServices.webp';
import TreatmentPlans from '@assets/images/Dashboard/menu/treatmentPlans.webp';
import YourReports from '@assets/images/Dashboard/menu/yourReports.webp';
import { ROUTES } from '@constants/routes';
import { DashboardTabs, useDashboardSettings } from '@hooks/contexts/dashboardContext';
import { useNavigation } from '@hooks/useNavigation';
import Typography from '@library/Typography';
import Image, { StaticImageData } from 'next/image';

interface NavigationMenuItemProps {
    image: StaticImageData;
    title: string;
    onClick?: () => void;
}

export const NavigationMenuItems = () => {
    const { setCurrentTab } = useDashboardSettings();
    const router = useNavigation();
    const menuItems: NavigationMenuItemProps[] = useMemo(
        () => [
            {
                image: DrE,
                title: 'Call with Dr.E',
                onClick: () => {
                    setCurrentTab(DashboardTabs.CHAT_WITH_DOCTOR);
                    router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
                },
            },
            {
                image: ChatHistory,
                title: 'Chat History',
                onClick: () => {
                    setCurrentTab(DashboardTabs.CHAT_HISTORY);
                    router.push(ROUTES.DASHBOARD_CHAT_HISTORY);
                },
            },
            {
                image: InstantDiagnosis,
                title: 'Instant Diagnosis',
            },
            {
                image: TreatmentPlans,
                title: 'Treatment Plans',
            },
            {
                image: DentalEducation,
                title: 'Dental Education',
            },
            {
                image: YourReports,
                title: 'Your Reports',
            },

            {
                image: DigitalPlanning,
                title: 'Digital Planning',
            },
            {
                image: LabServices,
                title: 'Lab Services',
            },
        ],
        [router, setCurrentTab],
    );
    return (
        <div className="navigation-menu-items-wrapper">
            {menuItems.map((item, index) => (
                <div key={index} className="navigation-menu-item" onClick={item.onClick}>
                    <Image src={item.image} alt={item.title} />
                    <Typography type="caption" weight="regular" text={item.title} as="small" color={colors.Gray3} />
                </div>
            ))}
        </div>
    );
};
