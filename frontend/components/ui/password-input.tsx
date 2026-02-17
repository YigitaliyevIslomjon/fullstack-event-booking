'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './input';
import { cn } from '@/lib/utils';

type PasswordInputProps = Omit<InputProps, 'type'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	({ ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		return (
			<Input
				{...props}
				type={showPassword ? 'text' : 'password'}
				ref={ref}
				iconSuffix={< button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
				</button >}
			/>
		);
	}
);
