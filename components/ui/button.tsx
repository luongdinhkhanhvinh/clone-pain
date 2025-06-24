import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 shadow-sm hover:bg-slate-800 hover:shadow-md border border-slate-900",
        destructive: "bg-red-500 text-slate-50 shadow-sm hover:bg-red-600",
        outline:
          "border border-slate-300 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-400 hover:shadow-md text-slate-900",
        secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 border border-slate-200",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-700",
        link: "text-slate-900 underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg hover:shadow-xl hover:from-slate-800 hover:to-slate-700 border border-slate-900",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-[2px]",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, radius, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
