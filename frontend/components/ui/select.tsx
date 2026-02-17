'use client';

import * as React from 'react';
import { Select as RadixSelect } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const triggerClasses =
  'flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50';

const contentClasses =
  'z-50 max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg';

const itemClasses =
  'relative flex cursor-pointer items-center rounded-md py-2 pl-3 pr-8 text-sm outline-none hover:bg-gray-100 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700';

export function Select({ value, onValueChange, options, placeholder, className }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger className={cn(triggerClasses, className)}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon asChild>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content sideOffset={4} className={contentClasses} position="popper">
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item key={opt.value} value={opt.value} className={itemClasses}>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                <span className="absolute right-2">
                  <RadixSelect.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                </span>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
