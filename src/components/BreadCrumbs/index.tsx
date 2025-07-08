import './breadCrumbs.scss';
import colors from '@theme/colors.module.scss';

import React, { Fragment } from 'react';
import RightArrow from '@assets/icons/rightArrow.svg';
import Typography from '@library/Typography';

type BreadCrumbsProps = {
    items: string[];
    className?: string;
    style?: React.CSSProperties;
};

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items, className, style }) => {
    return (
        <div className={`breadCrumbs ${className ?? ''}`} style={style}>
            {items.map((item, index, arr) => (
                <Fragment key={index}>
                    <Typography key={index} type="caption" weight="light" text={item} as="span" color={index === arr.length - 1 ? colors.Gray3 : 'gray'} />
                    {index !== arr.length - 1 && <RightArrow />}
                </Fragment>
            ))}
        </div>
    );
};
