'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label, type LabelState, type LabelSize } from './Label';

export type InputState = LabelState;
export type InputSize = LabelSize;

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
	label?: string;
	title?: string;
	error?: string;
	message?: string;
	state?: InputState;
	size?: InputSize;
	required?: boolean;
	iconPrefix?: React.ReactNode;
	iconSuffix?: React.ReactNode;
	onIconPrefixClick?: () => void;
	onIconSuffixClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type = 'text',
			label,
			title,
			error,
			message: messageProp,
			state: stateProp,
			size = 'md',
			required,
			iconPrefix,
			iconSuffix,
			onIconPrefixClick,
			onIconSuffixClick,
			id,
			name,
			onFocus,
			onBlur,
			disabled,
			...rest
		},
		ref
	) => {
		const [isFocused, setFocused] = React.useState(false);
		const hasError = Boolean(error);
		const state: LabelState = hasError ? 'error' : stateProp ?? 'default';
		const message = hasError ? error : messageProp;
		const labelText = title ?? label;
		const hasWrapper = Boolean(labelText || message || required || iconPrefix || iconSuffix);

		const inputEl = (
			<input
				ref={ref}
				type={type}
				id={id ?? name}
				name={name}
				aria-invalid={hasError}
				aria-required={required}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck={false}
				disabled={disabled}
				onFocus={(e) => {
					setFocused(true);
					onFocus?.(e);
				}}
				onBlur={(e) => {
					setFocused(false);
					onBlur?.(e);
				}}
				className={cn(
					'block w-full border-0 bg-transparent p-0 text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60',
					'text-base sm:text-sm'
				)}
				{...rest}
			/>
		);

		if (!hasWrapper) {
			return (
				<div
					className={cn(
						'flex w-full min-w-0 shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500',
						size === 'sm' && 'min-h-[40px]',
						size === 'md' && 'min-h-[48px]',
						size === 'lg' && 'min-h-[56px]',
						className
					)}
				>
					{inputEl}
				</div>
			);
		}

		return (
			<Label
				state={state}
				size={size}
				title={labelText}
				message={message}
				isFocused={isFocused}
				disabled={disabled}
				required={required}
				htmlFor={id ?? name}
				iconPrefix={iconPrefix}
				iconSuffix={iconSuffix}
				onIconPrefix={onIconPrefixClick}
				onIconSuffix={onIconSuffixClick}
				className={className}
			>
				{inputEl}
			</Label>
		);
	}
);

