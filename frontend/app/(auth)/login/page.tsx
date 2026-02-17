'use client';

// core
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// components
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui';
import * as AuthModule from '@/modules/auth';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to book amazing events</p>
          </div>

          <AuthModule.Forms.Login

            className="space-y-6"
          >
            {({ isSubmitting, register, errors }) => (
              <>
                <Input
                  id="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <PasswordInput
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </>
            )}
          </AuthModule.Forms.Login>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Register
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Test credentials: <span className="font-mono">john@example.com</span> /{' '}
              <span className="font-mono">Password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
