'use client';
import './signin.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';
import { set, useForm } from 'react-hook-form';
import Google from '@assets/icons/google.svg';
import { TransparentLoaderModal } from '@components/Dashboard/Global/TransparentLoaderModal';
import { OneTapGoogleLogin } from '@components/Dashboard/OneTapGoogleLogin';
import { ROUTES } from '@constants/routes';
import { SessionStorage } from '@Customtypes/sessionStorage';
import { stylize } from '@functions/stylize';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@library/Button';
import CustomInput from '@library/CustomInput';
import Typography from '@library/Typography';
import { View } from '@library/View';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { basicAuthLogin, loginWithGoogle, signUpUser } from '@services/api/auth';
import { loginSchema } from '@utils/schema';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
type SignInProps = {
    children?: React.ReactNode;
};

export const SignIn: React.FC<SignInProps> = ({ children }) => {
    const [isGoogleSignInLoading, startGoogleSignInTrxn] = React.useTransition();
    const login = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'popup',
        onSuccess: tokenResponse => {
            startGoogleSignInTrxn(async () => {
                console.log(tokenResponse);
                try {
                    const code = tokenResponse.code;
                    if (code) {
                        const { accessToken } = await loginWithGoogle({ code });
                        console.log('next');
                        console.log(accessToken);
                        localStorage.setItem(SessionStorage.ACCESS_TOKEN, accessToken);
                        console.log('success');
                        router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    console.log('next');
                }
            });
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<yup.InferType<typeof loginSchema>>({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    });
    const router = useRouter();
    const [isLoading, startTransition] = React.useTransition();

    const onSubmit = handleSubmit(data => {
        startTransition(async () => {
            try {
                const { email, password } = data;
                console.log(email, password);

                const response = await basicAuthLogin(data);

                if (response.accessToken) {
                    localStorage.setItem(SessionStorage.ACCESS_TOKEN, response.accessToken);
                    reset();
                    router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
                } else {
                    setError('root', { message: 'Invalid credentials' });
                }
            } catch (error: any) {
                setError('root', { message: error?.response?.data?.error_message || error?.message || 'something went wrong' });
            } finally {
                setTimeout(() => {
                    setError('root', { message: '' });
                }, 3000);
            }
        });
        return;
    });
    return (
        <>
            {isGoogleSignInLoading && <TransparentLoaderModal />}
            <View className="signin-container" as={'section'}>
                <OneTapGoogleLogin startGoogleSignInTrxn={startGoogleSignInTrxn} />
                <div className="signin-wrapper">
                    <div className="title-container">
                        <Typography type="h3" weight="semibold" text="Login to your account" color="black" as="h1" />
                    </div>

                    <div className="oauth-options">
                        <Button
                            label={<Typography type="p2" weight="regular" text="Login with Google" color="black" />}
                            buttonType="primary"
                            id="login-with-btn"
                            type="button"
                            backgroundColor={'white'}
                            backgroundColorOnHover={colors.B0}
                            style={{ border: '1px solid #c4c4c4' }}
                            leftIcon={Google}
                            onClick={() => login()}
                        />
                    </div>
                    <div className="line-breaker">
                        <Typography type="caption" weight="light" text={<span>Continue with email</span>} color="gray" as="strong" />
                    </div>
                    <form method="POST" onSubmit={onSubmit} id="signin-form">
                        <CustomInput
                            type="email"
                            placeholder="Enter your email"
                            label="Email"
                            isRequired
                            {...register('email')}
                            error={errors?.email?.message}
                            groupClass={errors?.email?.message ? 'error' : ''}
                        />
                        <CustomInput
                            type="password"
                            placeholder="Enter your password"
                            label="Password"
                            isRequired
                            {...register('password')}
                            error={errors?.password?.message}
                            groupClass={errors?.password?.message ? 'error' : ''}
                            hasEye
                        />
                        <Button
                            label={<Typography type="p2" weight="regular" text="Sign In" color="white" />}
                            buttonType="primary"
                            id="signin-btn"
                            type="submit"
                            isLoading={isLoading}
                            className="signin-btn swipe-btn"
                        />
                        {errors?.root?.message && <Typography type="caption" weight="light" text={errors?.root?.message} color="red" as="small" />}
                    </form>
                    <div className="navigation">
                        <Typography type="p3" weight="regular" text={stylize(`Don't have an account?{link-1}Sign Up{/link-1}`, [ROUTES.SIGN_UP])} color="black" as="strong" />
                    </div>
                </div>
                <div className="intro-slider-wrapper">{children}</div>
            </View>
        </>
    );
};
