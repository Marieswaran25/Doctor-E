import './introSliderCard.scss';

import React from 'react';
import Typography from '@library/Typography';
import { IntroSliderDataProps } from '@utils/introSliderData';

type IntroSliderCardProps = {
    slide: IntroSliderDataProps;
    children?: React.ReactNode;
};

export const IntroSliderCard: React.FC<IntroSliderCardProps> = ({ slide, children }) => {
    return (
        <div className="intro-slide-card" style={{ backgroundImage: `url(${slide.image.src})` }}>
            <div className="intro-slide-overlay">
                <Typography type="p3" weight="regular" text={slide.subtitle} color="white" as="h1" />
                <div className="intro-slide-footer">
                    <div className="intro-slide-text">
                        <Typography type="caption" weight="regular" text={slide.description} color="white" as="p" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};
