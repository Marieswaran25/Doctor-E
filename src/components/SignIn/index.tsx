'use client';
import './signin.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';
import { set, useForm } from 'react-hook-form';
import Google from '@assets/icons/google.svg';
import { ROUTES } from '@constants/routes';
import { stylize } from '@functions/stylize';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@library/Button';
import CustomInput from '@library/CustomInput';
import Typography from '@library/Typography';
import { View } from '@library/View';
import { loginSchema } from '@utils/schema';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
type SignInProps = {
    children?: React.ReactNode;
};

export const SignIn: React.FC<SignInProps> = ({ children }) => {
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
            const { email, password } = data;
            console.log(email, password);

            if (email === 'dre@gmail.com' && password === 'dre@2025') {
                reset();
                router.push(ROUTES.CHAT_WITH_DOCTOR);
            } else {
                setError('root', { message: 'Invalid credentials' });
            }
        });
        return;
    });
    return (
        <View className="signin-container" as={'section'}>
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
    );
};
