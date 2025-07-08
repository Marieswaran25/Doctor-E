import React from 'react';
import { IntroSlider } from '@components/IntroSlider';
import { Navbar } from '@components/Navbar';
import { SignUp } from '@components/SignUp';

export default function SignUpPage() {
    return (
        <>
            <Navbar />
            <main style={{ position: 'relative', marginTop: '100px' }}>
                <SignUp>
                    <IntroSlider />
                </SignUp>
            </main>
        </>
    );
}
