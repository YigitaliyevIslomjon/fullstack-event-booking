'use client';

// core
import React from 'react';
import { useRouter } from 'next/navigation';
// hooks
import {
  FormProvider,
  useForm,
  type UseFormRegister,
  type FieldErrors,
  type SubmitHandler,
} from 'react-hook-form';
// utils
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { LoginFormValues } from '@/modules/auth/hooks';
import { useLogin } from '@/modules/auth/hooks';
import toast from 'react-hot-toast';
// store
import { useAuthStore } from '@/store/auth-store';


const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required'),
});

export interface LoginFormChildrenProps {
  isSubmitting: boolean;
  setError: (field: keyof LoginFormValues, options: { type: string; message: string }) => void;
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
}

export interface LoginFormProps {
  className?: string;
  children: (props: LoginFormChildrenProps) => React.ReactNode;
}

const LoginForm: React.FC<LoginFormProps> = ({
  children,
  className,
}) => {
  // hooks
  const { login, isSubmitting } = useLogin();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const methods = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',

  });

  const { handleSubmit, setError, register, formState: { errors } } = methods;

  // methods
  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const data = await login(values);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Login successful!');
      router.push('/events');

    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {children({ isSubmitting, setError, register, errors })}
      </form>
    </FormProvider>
  );
};

export default LoginForm;
