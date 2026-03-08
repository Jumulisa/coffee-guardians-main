import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 active:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-destructive/25 active:bg-destructive/80",
        outline: "border-2 border-input bg-transparent hover:bg-accent/10 hover:border-accent hover:text-accent-foreground backdrop-blur-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-secondary/25",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground active:bg-accent/30",
        link: "text-primary underline-offset-4 hover:underline active:scale-100 hover:shadow-none",
        // New professional variants
        success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-500/30 active:bg-green-800",
        premium: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:shadow-orange-500/30",
        glow: "bg-green-600 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] active:shadow-[0_0_10px_rgba(34,197,94,0.3)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
