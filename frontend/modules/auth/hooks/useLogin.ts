'use client';

import { useState, useCallback } from 'react';
import { login as loginApi } from '@/modules/auth/api';
import type { AuthResponse } from '@/types';

export interface LoginFormValues {
  email: string;
  password: string;
}

export default function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useCallback(async (values: LoginFormValues): Promise<AuthResponse> => {
    setIsSubmitting(true);
    try {
      const data = await loginApi(values.email, values.password);
      return data;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { login, isSubmitting };
}
