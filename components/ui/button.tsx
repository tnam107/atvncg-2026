import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-orange-600 text-white shadow-[0_8px_24px_rgba(234,88,12,.24)] hover:-translate-y-0.5 hover:bg-orange-700",
        secondary: "border border-orange-200 bg-white text-stone-800 hover:border-orange-300 hover:bg-orange-50",
        ghost: "text-stone-700 hover:bg-orange-50 hover:text-orange-700",
        dark: "bg-stone-900 text-white hover:-translate-y-0.5 hover:bg-stone-800",
        danger: "bg-red-50 text-red-700 hover:bg-red-100",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
