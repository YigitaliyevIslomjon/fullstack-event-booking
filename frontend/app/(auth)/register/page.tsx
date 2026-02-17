'use client';

// core
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// store
import { useAuthStore } from '@/store/auth-store';
// components
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui';
import { PasswordRequirements } from './components';
// utils
import toast from 'react-hot-toast';

import type { AuthResponse } from '@/types';
import type { RegisterFormChildrenProps } from '@/modules/auth/forms/Register';
import * as AuthModule from '@/modules/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/events');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us to book amazing events</p>
          </div>

          <AuthModule.Forms.Register
            onSuccess={(data: AuthResponse) => {
              setAuth(data.user, data.accessToken, data.refreshToken);
              toast.success('Registration successful!');
              router.push('/events');
            }}
            onError={(message: string) => toast.error(message)}
            className="space-y-5"
          >
            {({ isSubmitting, register, errors }: RegisterFormChildrenProps) => (
              <>
                <Input
                  id="name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <PasswordRequirements />
                </div>

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </>
            )}
          </AuthModule.Forms.Register>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
