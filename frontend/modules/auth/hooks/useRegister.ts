'use client';

import { useState, useCallback } from 'react';
import { register } from '@/modules/auth/api';
import type { AuthResponse } from '@/types';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function useRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerUser = useCallback(async (values: RegisterFormValues): Promise<AuthResponse> => {
    setIsSubmitting(true);
    try {
      const data = await register(values.email, values.password, values.name);
      return data;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { registerUser, isSubmitting };
}
