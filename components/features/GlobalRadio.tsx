"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Volume2, VolumeX, SkipForward } from "lucide-react";
import webSocketService from "@/lib/websocket-service";

interface RadioState {
    track: string;
    elapsed: number;
    total: number;
    status: string;
}

export default function GlobalRadio() {
    const [radioState, setRadioState] = useState<RadioState | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Simulated "Lofi" visualizer bars
    const bars = [1, 2, 3, 4, 5, 4, 3, 2];

    useEffect(() => {
        const subscription = webSocketService.subscribe('/topic/radio', (data: unknown) => {
            const update = data as RadioState;
            setRadioState(update);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Mock Audio Playback (Silent for now, or use a placeholder)
    useEffect(() => {
        if (!isMuted && radioState?.status === "LIVE") {
            // in a real app, we'd sync this with the actual track URL
            // and seek to radioState.elapsed
            console.log("Syncing audio to", radioState.elapsed);
        }
    }, [radioState, isMuted]);

    if (!radioState) return <div className="p-4 text-xs text-white/20">Scanning frequencies...</div>;

    const progressPercent = (radioState.elapsed / radioState.total) * 100;

    return (
        <div className="bg-black/20 border border-white/5 rounded-xl p-4 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Radio size={14} className={`text-blud-orange ${!isMuted ? "animate-pulse" : "opacity-50"}`} />
                        {!isMuted && (
                            <div className="absolute inset-0 bg-blud-orange rounded-full blur-md opacity-50 animate-ping" />
                        )}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blud-orange">
                        Radio Blud
                    </span>
                </div>

                <button
                    onClick={() => setIsMuted(prev => !prev)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </div>

            <div className="space-y-1 relative z-10">
                <p className="text-sm font-medium text-white/90 truncate font-serif">
                    {radioState.track.split(" - ")[0]}
                </p>
                <p className="text-xs text-white/40 truncate">
                    {radioState.track.split(" - ")[1] || "Unknown Track"}
                </p>
            </div>

            {/* Visualizer */}
            {!isMuted && (
                <div className="flex items-end gap-[2px] h-4 mt-3 opacity-50">
                    {bars.map((h, i) => (
                        <motion.div
                            key={i}
                            className="bg-blud-orange w-1 rounded-t-sm"
                            animate={{
                                height: [4, h * 3, 4],
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{
                                duration: 0.5 + Math.random() * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <motion.div
                    className="h-full bg-blud-orange"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ ease: "linear", duration: 1 }}
                />
            </div>
        </div>
    );
}
