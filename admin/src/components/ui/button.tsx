import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-medium transition-[background,transform,box-shadow] duration-150 ease-[var(--ease-bd)] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-bd-orange text-white shadow-[0_1px_0_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-bd-orange-600',
        secondary:
          'bg-elev text-text border border-border-strong shadow-xs hover:bg-surface-3',
        ghost: 'text-text-2 hover:bg-surface-3',
        ink: 'bg-text text-text-inv shadow-xs hover:opacity-90',
        danger: 'bg-err text-white shadow-xs hover:opacity-90',
      },
      size: {
        sm: 'h-7 px-2.5 text-[12.5px] gap-1.5',
        md: 'h-[34px] px-3 text-[13.5px]',
        lg: 'h-10 px-3.5 text-sm',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
