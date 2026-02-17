'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const requirements = [
  { key: 'length', label: 'At least 8 characters', check: (v: string) => v.length >= 8 },
  {
    key: 'letterNumber',
    label: 'At least one letter and one number',
    check: (v: string) => /(?=.*[A-Za-z])(?=.*\d)/.test(v),
  },
]

export default function PasswordRequirements() {
  const { control } = useFormContext();
  const password = useWatch({ control, name: 'password', defaultValue: '' });
  const value = (password ?? '') as string;

  return (
    <ul className="space-y-1.5 mb-2">
      {requirements.map(({ key, label, check }) => {
        const met = check(value);
        return (
          <li
            key={key}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors',
              met ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {met ? (
              <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
