import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup.string().email('Invalid Email address').required('Email address is required'),
    password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid Email address').required('Email address is required'),
    mobileNumber: yup.string().required('Mobile number is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
});
