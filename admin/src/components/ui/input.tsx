import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'h-9 w-full rounded-[8px] border border-border bg-surface-2 px-3 text-[13px] text-text',
      'placeholder:text-text-3',
      'focus:outline-none focus:border-bd-orange focus:ring-2 focus:ring-bd-orange/20',
      'disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
