'use client';

import React, { useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './introSlider.scss';
import Image, { StaticImageData } from 'next/image';
import { Button } from '@library/Button';

// Import assets
import leftArrow from '@assets/icons/leftArrow.svg';
import rightArrow from '@assets/icons/rightArrow.svg';
import drE from '@assets/icons/drE.webp';
import scan from "@assets/icons/scan.gif";
import ai from "@assets/icons/ai.gif";
import innovation from "@assets/icons/innovation.gif";

// Types
interface SlideData {
  id: string;
  image: StaticImageData | string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
}

interface SlideProps {
  slide: SlideData;
  onNext: () => void;
  onPrev: () => void;
}

interface ArrowControlsProps {
  onNext: () => void;
  onPrev: () => void;
}

// Slide data configuration
const SLIDES_DATA: SlideData[] = [
  {
    id: 'welcome',
    image: drE,
    imageAlt: 'Dr. E avatar waving',
    title: 'Welcome to Dr. E',
    subtitle: 'Your Digital Dental Assistant',
    description: 'Get instant diagnostics, treatment planning, and expert insights-right from your phone or desktop.',
  },
  {
    id: 'diagnose',
    image: scan,
    imageAlt: 'AI Scan',
    title: 'Diagnose in Seconds',
    subtitle: 'Instant Diagnosis from Scans',
    description: 'Upload Images, X-rays, CBCTs, or 3D files and let Dr. E analyze them instantly with AI-driven precision.',
  },
  {
    id: 'treatment',
    image: ai,
    imageAlt: 'Dental Planning',
    title: 'Smarter Treatment Plans',
    subtitle: 'AI-Powered Dental Planning',
    description: 'Create and customize treatment plans, basic to advanced, in just a few taps. Perfect for every patient case.',
  },
  {
    id: 'education',
    image: innovation,
    imageAlt: 'Education',
    title: 'Education Meets Innovation',
    subtitle: 'Grow with Knowledge',
    description: 'Access dental courses, lab support, and case reviews. Built to support both new and experienced dentists.',
  },
];

// Slider settings configuration
const SLIDER_SETTINGS = {
  dots: false,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
} as const;

// Arrow Controls Component
const ArrowControls: React.FC<ArrowControlsProps> = ({ onNext, onPrev }) => (
  <div className="bottom-arrows">
    <Button
      label=""
      leftIcon={leftArrow}
      onClick={onPrev}
      className="arrow-button"
      aria-label="Previous slide"
    />
    <Button
      label=""
      leftIcon={rightArrow}
      onClick={onNext}
      className="arrow-button"
      aria-label="Next slide"
    />
  </div>
);

// Individual Slide Component
const SlideComponent: React.FC<SlideProps> = ({ slide, onNext, onPrev }) => (
  <div className="slide">
    <Image
      src={slide.image}
      alt={slide.imageAlt}
      width={150}
      height={150}
      className="slide-image"
      priority={slide.id === 'welcome'} // Prioritize first slide
    />
    <h1>{slide.title}</h1>
    <div className="slide-footer">
      <div className="slide-text">
        <h3>{slide.subtitle}</h3>
        <p>{slide.description}</p>
      </div>
      <ArrowControls onNext={onNext} onPrev={onPrev} />
    </div>
  </div>
);

// Main IntroSlider Component
const IntroSlider: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="intro-app">
      <div className="intro-card">
        <Slider {...SLIDER_SETTINGS} ref={sliderRef}>
          {SLIDES_DATA.map((slide) => (
            <SlideComponent
              key={slide.id}
              slide={slide}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default IntroSlider;