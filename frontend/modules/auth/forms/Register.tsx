'use client';

import React from 'react';
import { FormProvider, useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { AuthResponse } from '@/types';
import type { RegisterFormValues } from '../hooks/useRegister';
import useRegister from '../hooks/useRegister';
import { useAuthStore } from '@/store/auth-store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export interface RegisterFormChildrenProps {
  isSubmitting: boolean;
  setError: (field: keyof RegisterFormValues, options: { type: string; message: string }) => void;
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
}

export interface RegisterFormProps {
  className?: string;
  children: (props: RegisterFormChildrenProps) => React.ReactNode;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  children,
  className,
}) => {

  const { registerUser, isSubmitting } = useRegister();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const { handleSubmit, setError, register, formState: { errors } } = methods;

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const data = await registerUser(values);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Registration successful!');
      router.push('/events');

    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message)
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {children({ isSubmitting, setError, register, errors })}
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
