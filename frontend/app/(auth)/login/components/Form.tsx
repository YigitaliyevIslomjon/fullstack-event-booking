'use client';

// components
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui';
// modules
import * as AuthModule from '@/modules/auth';

export default function LoginForm() {
  return (
    <AuthModule.Forms.Login className="space-y-1">
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
  );
}
