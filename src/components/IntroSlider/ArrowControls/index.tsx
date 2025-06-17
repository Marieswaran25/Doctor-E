import './arrowControls.scss';

import React from 'react';
import leftArrow from '@assets/icons/leftArrow.svg';
import rightArrow from '@assets/icons/rightArrow.svg';
import { Button } from '@library/Button';
type ArrowControlsProps = {
    onNext: () => void;
    onPrev: () => void;
};
export const ArrowControls: React.FC<ArrowControlsProps> = ({ onNext, onPrev }) => (
    <div className="bottom-arrows">
        <Button label="" leftIcon={leftArrow} onClick={onPrev} className="arrow-button" aria-label="Previous slide" />
        <Button label="" leftIcon={rightArrow} onClick={onNext} className="arrow-button" aria-label="Next slide" />
    </div>
);
