'use client';
import './signup.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';
import { useForm } from 'react-hook-form';
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
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogle, signUpUser } from '@services/api/auth';
import { signUpSchema } from '@utils/schema';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

export const SignUp: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [isGoogleSignInLoading, startGoogleSignInTrxn] = React.useTransition();

    const router = useRouter();
    const googleSignUp = useGoogleLogin({
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
                        sessionStorage.setItem(SessionStorage.ACCESS_TOKEN, accessToken);
                        console.log('success');
                        router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        },
    });
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<yup.InferType<typeof signUpSchema>>({
        resolver: yupResolver(signUpSchema),
        mode: 'onChange',
    });
    const [isLoading, startTransition] = React.useTransition();

    const onSubmit = handleSubmit(async data => {
        startTransition(async () => {
            try {
                console.log(data);
                const response = await signUpUser({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    mobileNumber: data.mobileNumber,
                    metadata: {
                        language: navigator?.language || 'en-US',
                    },
                });
                if (response.accessToken) {
                    sessionStorage.setItem(SessionStorage.ACCESS_TOKEN, response.accessToken);
                    reset();
                    router.push(ROUTES.DASHBOARD_CHAT_WITH_DOCTOR);
                } else {
                    console.log(response);
                    setError('root', { message: 'cannot create account' });
                }
            } catch (error: any) {
                setError('root', { message: error?.response?.data?.error_message || error?.message || 'something went wrong' });
            } finally {
                setTimeout(() => {
                    setError('root', { message: '' });
                }, 3000);
            }
        });
    });
    return (
        <>
            {isGoogleSignInLoading && <TransparentLoaderModal />}
            <View className="signup-container" as={'section'}>
                <OneTapGoogleLogin startGoogleSignInTrxn={startGoogleSignInTrxn} />
                <div className="signup-wrapper">
                    <div className="title-container">
                        <Typography type="h3" weight="semibold" text="Create your account" color="black" as="h1" />
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
                            onClick={() => googleSignUp()}
                        />
                    </div>
                    <div className="line-breaker">
                        <Typography type="caption" weight="light" text={<span>Continue with email</span>} color="gray" as="strong" />
                    </div>
                    <form method="POST" onSubmit={onSubmit} id="signup-form">
                        <CustomInput
                            type="text"
                            placeholder="Enter your username"
                            label="Username"
                            inputMode="text"
                            isRequired
                            {...register('username')}
                            error={errors?.username?.message}
                            groupClass={errors?.username?.message ? 'error' : ''}
                        />
                        <CustomInput
                            type="email"
                            placeholder="Enter your email"
                            label="Email"
                            inputMode="email"
                            isRequired
                            {...register('email')}
                            error={errors?.email?.message}
                            groupClass={errors?.email?.message ? 'error' : ''}
                        />
                        <CustomInput
                            type="tel"
                            inputMode="numeric"
                            placeholder="Enter your mobile number"
                            label="Mobile Number"
                            isRequired
                            maxLength={10}
                            {...register('mobileNumber')}
                            error={errors?.mobileNumber?.message}
                            groupClass={errors?.mobileNumber?.message ? 'error' : ''}
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
                        <CustomInput
                            type="password"
                            placeholder="Re-enter your password"
                            label="Confirm Password"
                            isRequired
                            {...register('confirmPassword')}
                            error={errors?.confirmPassword?.message}
                            groupClass={errors?.confirmPassword?.message ? 'error' : ''}
                            hasEye
                        />
                        <Button
                            label={<Typography type="p2" weight="regular" text="Sign In" color="white" />}
                            buttonType="primary"
                            id="sign-up-btn"
                            type="submit"
                            className="signup-btn swipe-btn"
                            isLoading={isLoading}
                        />
                        {errors?.root?.message && <Typography type="caption" weight="regular" text={errors?.root?.message} color="red" as="small" />}
                    </form>
                    <div className="navigation">
                        <Typography type="p3" weight="regular" text={stylize(`Already have an account?{link-1}Sign In{/link-1}`, [ROUTES.SIGN_IN])} color="black" as="strong" />
                    </div>
                </div>
                <div className="intro-slider-wrapper">{children}</div>
            </View>
        </>
    );
};
