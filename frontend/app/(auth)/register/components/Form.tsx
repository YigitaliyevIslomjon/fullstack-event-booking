'use client';

// components
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui';
import { RegisterFormChildrenProps } from '@/modules/auth/forms/Register';
import PasswordRequirements from './PasswordRequirements';
// modules
import * as AuthModule from '@/modules/auth';


export default function RegisterForm() {
  return (
    <AuthModule.Forms.Register
      className=""
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

          <div className="mb-3">
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
  );
}
