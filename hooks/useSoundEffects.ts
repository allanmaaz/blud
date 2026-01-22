"use client";

import { useRef, useCallback, useEffect, useState } from "react";

type SoundType = "click" | "hover" | "success" | "error" | "switch";

interface SoundOptions {
    volume?: number;
    pitch?: number;
}

export function useSoundEffects() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
            }
        }
        if (audioContextRef.current?.state === "suspended") {
            audioContextRef.current.resume();
        }
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            // We generally don't want to close the global context on unmount of a hook if shared,
            // but here we are designing it as a hook used by a Provider ideally.
            // If used individually, it might be expensive. We'll rely on the Provider to use this once.
        };
    }, []);

    const playSound = useCallback((type: SoundType, options: SoundOptions = {}) => {
        if (isMuted) return;
        initAudio();

        const ctx = audioContextRef.current;
        if (!ctx) return;

        const t = ctx.currentTime;
        const volume = options.volume ?? 0.1; // Default low volume for UI
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Sound design tailored for "Blud" (Warm, organic, minimal)
        switch (type) {
            case "click":
                // Crisp, short, woody click
                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(600, t);
                oscillator.frequency.exponentialRampToValueAtTime(300, t + 0.1);
                gainNode.gain.setValueAtTime(volume, t);
                gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
                oscillator.start(t);
                oscillator.stop(t + 0.1);
                break;

            case "hover":
                // Very subtle high frequency breath
                oscillator.type = "triangle";
                oscillator.frequency.setValueAtTime(800, t); // Higher pitch
                gainNode.gain.setValueAtTime(0, t);
                gainNode.gain.linearRampToValueAtTime(volume * 0.2, t + 0.02); // Very quiet
                gainNode.gain.linearRampToValueAtTime(0, t + 0.05);
                oscillator.start(t);
                oscillator.stop(t + 0.05);
                break;

            case "switch":
                // Toggle sound
                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(400, t);
                gainNode.gain.setValueAtTime(volume, t);
                gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
                oscillator.start(t);
                oscillator.stop(t + 0.15);
                break;

            case "success":
                // Pleasant major chordish arp
                const playNote = (freq: number, offset: number) => {
                    const osc = ctx.createOscillator();
                    const gn = ctx.createGain();
                    osc.connect(gn);
                    gn.connect(ctx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, t + offset);
                    gn.gain.setValueAtTime(volume * 0.8, t + offset);
                    gn.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.4);
                    osc.start(t + offset);
                    osc.stop(t + offset + 0.4);
                };
                playNote(440, 0); // A4
                playNote(554.37, 0.05); // C#5
                playNote(659.25, 0.10); // E5
                break;

            case "error":
                // Soft dissonant bump
                oscillator.type = "sawtooth";
                oscillator.frequency.setValueAtTime(150, t);
                oscillator.frequency.linearRampToValueAtTime(100, t + 0.2);
                gainNode.gain.setValueAtTime(volume * 0.5, t);
                gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
                oscillator.start(t);
                oscillator.stop(t + 0.2);
                break;
        }
    }, [isMuted, initAudio]);

    // Convenience methods
    const playClick = () => playSound("click");
    const playHover = () => playSound("hover");
    const playSuccess = () => playSound("success");
    const playError = () => playSound("error");
    const playSwitch = () => playSound("switch");

    return {
        playSound,
        playClick,
        playHover,
        playSuccess,
        playError,
        playSubmit: playSuccess, // Keep alias for backward compat if needed
        playSwitch,
        isMuted,
        setIsMuted
    };
}
