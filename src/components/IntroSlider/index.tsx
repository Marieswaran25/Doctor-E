'use client';

import './introSlider.scss';

import React, { useCallback, useRef } from 'react';
import Slider, { Settings } from 'react-slick';
import { INTRO_SLIDER_DATA } from '@utils/introSliderData';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { ArrowControls } from './ArrowControls';
import { IntroSliderCard } from './introSliderCard';

export const IntroSlider: React.FC = () => {
    const sliderRef = useRef<Slider | null>(null);

    const handleNext = useCallback(() => {
        sliderRef.current?.slickNext();
    }, []);

    const handlePrev = useCallback(() => {
        sliderRef.current?.slickPrev();
    }, []);

    const SLIDER_SETTINGS: Settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        autoplay: true,
        responsive: [],
    } as const;

    return (
        <div className="intro-app">
            <div className="intro-card">
                <Slider {...SLIDER_SETTINGS} ref={sliderRef}>
                    {INTRO_SLIDER_DATA.map(slide => (
                        <IntroSliderCard key={slide.id} slide={slide}>
                            <ArrowControls onNext={handleNext} onPrev={handlePrev} />
                        </IntroSliderCard>
                    ))}
                </Slider>
            </div>
        </div>
    );
};
