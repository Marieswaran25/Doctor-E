import './loader.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';

type LoaderProps = {
    borderTopColor?: string;
    children?: React.ReactNode;
    className?: string;
};

export const Loader: React.FC<LoaderProps> = ({ className = '', borderTopColor = colors.DotBlue, children }) => {
    return (
        <div className={`loader-wrapper ${className}`}>
            <div className="loader" style={{ borderTopColor }}></div>
            {children}
        </div>
    );
};
