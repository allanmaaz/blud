"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface SoundContextType {
    playClick: () => void;
    playHover: () => void;
    playSuccess: () => void;
    playError: () => void;
    playSwitch: () => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
    const { playClick, playHover, playSuccess, playError, playSwitch, isMuted, setIsMuted } = useSoundEffects();

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{ playClick, playHover, playSuccess, playError, playSwitch, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
}
