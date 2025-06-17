import './banner.scss';

import React from 'react';
import doctor from '@assets/icons/dre2.webp';
import { ROUTES } from '@constants/routes';
import { Button } from '@library/Button';
import { TypingText } from '@library/TypingText';
import Typography from '@library/Typography';
import { View } from '@library/View';
import Image from 'next/image';
import Link from 'next/link';

export const Banner = () => {
    return (
        <header className="banner">
            <View className="banner-container">
                <div className="banner-left">
                    <Typography
                        type="d4"
                        weight="semibold"
                        style={{ display: 'inline-block' }}
                        text={
                            <>
                                Elevating the future of dental care with
                                <TypingText text="  Dr.Eduardo" weight="semibold" speed={300} color="#254156" as="span" type="d3" />
                            </>
                        }
                        color="#658192"
                        as="h1"
                    />

                    <Link href={ROUTES.SIGN_IN} className="swipe-btn">
                        <Button
                            label={<Typography type="p2" weight="regular" text="Get Started" color="white" />}
                            buttonType="primary"
                            id="get-started-btn"
                            type="button"
                            className="get-started-btn"
                        />
                    </Link>
                </div>
                <div className="banner-right">
                    <Image src={doctor} alt="logo" width={400} height={400} />
                </div>
            </View>
        </header>
    );
};
