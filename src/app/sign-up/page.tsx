import React from 'react';
import { IntroSlider } from '@components/IntroSlider';
import { SignUp } from '@components/SignUp';

export default function SignUpPage() {
    return (
        <main style={{ position: 'relative', marginTop: '100px' }}>
            <SignUp>
                <IntroSlider />
            </SignUp>
        </main>
    );
}
