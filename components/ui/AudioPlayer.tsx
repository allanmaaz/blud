"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";

export default function AudioPlayer({ duration = "0:14" }: { duration?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const { playSwitch, playHover } = useSound();

    // Mock progress interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1)); // Smoother increment
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleToggle = () => {
        playSwitch();
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            onMouseEnter={() => playHover()}
            className="flex items-center gap-3 bg-gradient-to-r from-blud-blue/5 to-transparent rounded-2xl p-3 pr-5 border border-blud-blue/10 w-full max-w-sm backdrop-blur-sm shadow-sm hover:shadow-md transition-all group"
        >
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blud-blue text-blud-cream shadow-md shadow-blud-blue/20 shrink-0"
            >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </motion.button>

            <div className="flex flex-1 items-center gap-[2px] h-8 overflow-hidden mask-linear-fade">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            "w-1 rounded-full bg-blud-blue",
                            progress > (i / 30) * 100 ? "opacity-100" : "opacity-20"
                        )}
                        initial={false}
                        animate={{
                            height: isPlaying
                                ? `${20 + Math.random() * 60}%` // Jittery active state
                                : `${30 + Math.sin(i * 0.5) * 20}%`, // Gentle wave idle
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            mass: 0.5
                        }}
                    />
                ))}
            </div>

            <span className="text-[10px] font-mono font-medium text-blud-blue/60 shrink-0">{duration}</span>
        </div>
    );
}
