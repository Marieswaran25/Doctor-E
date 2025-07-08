import React from 'react';
import { IntroSlider } from '@components/IntroSlider';
import { Navbar } from '@components/Navbar';
import { SignIn } from '@components/SignIn';

export default function SignInPage() {
    return (
        <>
            <Navbar />
            <main style={{ position: 'relative', marginTop: '100px', display: 'flex' }}>
                <SignIn>
                    <IntroSlider />
                </SignIn>
            </main>
        </>
    );
}
