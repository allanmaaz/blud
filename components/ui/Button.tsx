import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { useSound } from "@/components/providers/SoundProvider"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blud-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2",
    {
        variants: {
            variant: {
                default:
                    "bg-blud-blue text-blud-cream shadow-md shadow-blud-blue/20 border-blud-blue",
                outline:
                    "bg-transparent text-blud-blue border-blud-blue/30 hover:border-blud-blue",
                ghost: "border-transparent hover:bg-blud-blue/5 text-blud-blue/80 hover:text-blud-blue",
                link: "text-blud-blue underline-offset-4 hover:underline border-none hover:text-blud-orange",
                accent: "bg-blud-orange text-white border-blud-orange shadow-md shadow-blud-orange/20"
            },
            size: {
                default: "h-11 px-6",
                sm: "h-9 rounded-full px-4 text-xs",
                lg: "h-14 rounded-full px-8 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "style">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    disableSound?: boolean
}

// Helper to wrap motion capability around Slot if needed, but easier to just use motion.button
// Since we are changing interactions significantly, we'll try to stick to motion.button implementation.
// However, asChild pattern with Radix Slot + Framer Motion is tricky.
// We will simply treat asChild as a static render for now if passed (rare in this codebase mostly), 
// but primarly upgrade the 'button' case.

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, disableSound = false, onClick, onMouseEnter, ...props }, ref) => {
        const { playClick, playHover } = useSound();

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disableSound) playClick();
            onClick?.(e);
        };

        const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disableSound) playHover();
            onMouseEnter?.(e);
        };

        if (asChild) {
            const Comp = Slot
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    {...props}
                />
            )
        }

        return (
            <motion.button
                ref={ref as any}
                className={cn(buttonVariants({ variant, size, className }))}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                {...(props as any)}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
