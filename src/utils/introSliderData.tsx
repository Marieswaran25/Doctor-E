import drE from '@assets/icons/drE.webp';
import ai from '@assets/images/ai.webp';
import scan from '@assets/images/diagnose.webp';
import innovation from '@assets/images/innovation.webp';
import { StaticImageData } from 'next/image';

export interface IntroSliderDataProps {
    id: string;
    image: StaticImageData;
    subtitle: string;
    description: string;
}

export const INTRO_SLIDER_DATA: IntroSliderDataProps[] = [
    {
        id: 'welcome',
        image: drE,
        subtitle: 'Your Digital Dental Assistant',
        description: 'Get instant diagnostics, treatment planning, and expert insights-right from your phone or desktop.',
    },
    {
        id: 'diagnose',
        image: scan,
        subtitle: 'Instant Diagnosis from Scans',
        description: 'Upload Images, X-rays, CBCTs, or 3D files and let Dr. E analyze them instantly with AI-driven precision.',
    },
    {
        id: 'treatment',
        image: ai,
        subtitle: 'AI-Powered Dental Planning',
        description: 'Create and customize treatment plans, basic to advanced, in just a few taps. Perfect for every patient case.',
    },
    {
        id: 'education',
        image: innovation,
        subtitle: 'Grow with Knowledge',
        description: 'Access dental courses, lab support, and case reviews. Built to support both new and experienced dentists.',
    },
];
