import './loader.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';

type LoaderProps = {
    borderTopColor?: string;
    children?: React.ReactNode;
};

export const Loader: React.FC<LoaderProps> = ({ borderTopColor = colors.DotBlue, children }) => {
    return (
        <div className="loader-wrapper">
            <div className="loader" style={{ borderTopColor }}></div>
            {children}
        </div>
    );
};
