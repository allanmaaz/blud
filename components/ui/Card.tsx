"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

import { Heart } from "lucide-react";
import { useState } from "react";

const Card = React.forwardRef<
    HTMLDivElement,
    HTMLMotionProps<"div">
>(({ className, children, ...props }, ref) => {
    const [liked, setLiked] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -4,
                scale: 1.01,
                boxShadow: "0 20px 40px rgba(10, 61, 122, 0.12)",
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "rounded-3xl border-2 border-blud-blue/15 bg-blud-cream/80 backdrop-blur-md p-6 text-blud-blue relative group shadow-lg shadow-blud-blue/5 hover:border-blud-blue/25",
                className
            )}
            {...props}
        >
            {children as React.ReactNode}

            <motion.button
                onClick={(e) => {
                    e.stopPropagation();
                    setLiked(!liked);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <motion.div
                    animate={liked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <Heart
                        size={20}
                        className={cn(
                            "transition-all duration-300",
                            liked ? "fill-blud-orange text-blud-orange drop-shadow-lg" : "text-blud-blue/40 hover:text-blud-orange/60"
                        )}
                    />
                </motion.div>
            </motion.button>
        </motion.div>
    );
})
Card.displayName = "Card"

export { Card }
