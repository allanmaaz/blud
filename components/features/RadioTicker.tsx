"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RadioTicker() {
    const [isMuted, setIsMuted] = useState(true);

    // Mock Playlists
    const playlist = [
        { user: "Sarah (Arch Year 2)", song: "Aphex Twin - #3" },
        { user: "Radio Blud", song: "Ambient Rainfall 004" },
        { user: "Philosophy Club", song: "Erik Satie - Gymnopédie No.1" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % playlist.length);
        }, 8000); // Rotate every 8s
        return () => clearInterval(timer);
    }, [playlist.length]);

    return (
        <div className="fixed bottom-[88px] md:bottom-0 left-0 right-0 z-30 pointer-events-none flex justify-center md:justify-start md:pl-[280px] md:pr-[320px]">
            <div className="bg-blud-blue text-blud-cream pointer-events-auto rounded-full md:rounded-none px-4 py-2 flex items-center gap-3 shadow-lg mx-6 md:mx-0 w-full max-w-md md:max-w-none border-t border-blud-blue/20">

                <div className="flex items-center gap-2 shrink-0">
                    <Radio size={14} className="animate-pulse text-blud-orange" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">On Air</span>
                </div>

                <div className="h-4 overflow-hidden flex-1 relative w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "anticipate" }}
                            className="absolute inset-0 flex items-center whitespace-nowrap"
                        >
                            <span className="text-xs font-medium truncate">
                                <span className="opacity-70 mr-1">{playlist[currentIndex].user} is playing:</span>
                                {playlist[currentIndex].song}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </div>
        </div>
    );
}
