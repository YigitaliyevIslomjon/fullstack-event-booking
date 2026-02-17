'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type LabelState = 'default' | 'success' | 'warning' | 'error';
export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps {
	state?: LabelState;
	size?: LabelSize;
	title?: string;
	message?: string;
	isFocused?: boolean;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	children: React.ReactNode;
	iconPrefix?: React.ReactNode;
	iconSuffix?: React.ReactNode;
	onIconPrefix?: () => void;
	onIconSuffix?: () => void;
	htmlFor?: string;
}

const stateBorder: Record<LabelState, string> = {
	default: 'border-gray-300',
	error: 'border-red-500',
	success: 'border-green-500',
	warning: 'border-amber-500',
};

const stateFocus: Record<LabelState, string> = {
	default: 'focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500',
	error: 'focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500',
	success: 'focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500',
	warning: 'focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500',
};

const stateMessage: Record<LabelState, string> = {
	default: 'text-gray-600',
	error: 'text-red-500',
	success: 'text-green-600',
	warning: 'text-amber-600',
};

const sizeClasses: Record<LabelSize, string> = {
	sm: 'min-h-[40px]',
	md: 'min-h-[48px]',
	lg: 'min-h-[56px]',
};

export const Label = React.forwardRef<HTMLDivElement, LabelProps>(
	(
		{
			state = 'default',
			size = 'md',
			title,
			message,
			isFocused,
			disabled,
			required,
			className,
			children,
			iconPrefix,
			iconSuffix,
			onIconPrefix,
			onIconSuffix,
			htmlFor,
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					'block w-full min-w-0',
					disabled && 'cursor-not-allowed opacity-70',
					className
				)}
			>
				<label htmlFor={htmlFor} className="block w-full min-w-0 cursor-pointer">
					{title && (
						<div className="mb-2 flex items-center gap-1">
							<span className="block text-sm font-medium text-gray-900">
								{title}
							</span>
							{required && <span className="text-red-500">*</span>}
						</div>
					)}
					<div
						className={cn(
							'flex w-full min-w-0 shrink-0 items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-colors',
							sizeClasses[size],
							stateBorder[state],
							stateFocus[state],
							isFocused && 'ring-1',
							disabled && 'cursor-not-allowed bg-gray-50 border-gray-200'
						)}
					>
						{iconPrefix && (
							<div
								role={onIconPrefix ? 'button' : undefined}
								onClick={onIconPrefix}
								className="flex shrink-0 items-center justify-center text-gray-500"
							>
								{iconPrefix}
							</div>
						)}
						<div className="min-w-0 flex-1">{children}</div>
						{iconSuffix && (
							<div
								role={onIconSuffix ? 'button' : undefined}
								onClick={onIconSuffix}
								className="flex shrink-0 items-center justify-center text-gray-500"
							>
								{iconSuffix}
							</div>
						)}
					</div>
				</label>
				{/* Reserve space so layout doesn't shift when message appears */}
				<div className="min-h-[20px]">
					{message && (
						<p
							className={cn('mt-1.5 text-xs', stateMessage[state])}
							role={state === 'error' ? 'alert' : undefined}
						>
							{message}
						</p>
					)}
				</div>
			</div>
		);
	}
);

Label.displayName = 'Label';
