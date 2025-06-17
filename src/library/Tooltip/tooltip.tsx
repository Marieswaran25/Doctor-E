'use client';

import './tooltip.scss';

import React, { useRef, useState } from 'react';

const Tooltip = ({ infoText, children, position, className, isLongPressed }: { infoText: string; children: React.ReactNode; position?: string; className?: string; isLongPressed?: boolean }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseDown = () => {
        if (isLongPressed) {
            longPressTimeout.current = setTimeout(() => setShowTooltip(true), 500);
        }
    };

    const handleMouseUp = () => {
        if (isLongPressed) {
            if (longPressTimeout.current) {
                clearTimeout(longPressTimeout.current);
                longPressTimeout.current = null;
            }
            setShowTooltip(false);
        }
    };

    const handleMouseEnter = () => {
        if (!isLongPressed) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isLongPressed) {
            setShowTooltip(false);
        }
    };

    const handleTouchStart = () => {
        if (isLongPressed) {
            longPressTimeout.current = setTimeout(() => setShowTooltip(true), 500);
        }
    };

    const handleTouchEnd = () => {
        if (isLongPressed) {
            if (longPressTimeout.current) {
                clearTimeout(longPressTimeout.current);
                longPressTimeout.current = null;
            }
            setShowTooltip(false);
        }
    };

    return (
        <div
            className={`tooltip-container ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {children}
            <div className={`tooltip ${position || ''} ${showTooltip ? 'open' : ''}`}>
                {infoText}
                <div className={`tooltip-arrow ${position || ''}`} />
            </div>
        </div>
    );
};

export default Tooltip;
