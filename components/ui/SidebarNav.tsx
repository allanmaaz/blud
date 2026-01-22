"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Settings, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTime } from "@/components/providers/TimeProvider";
import { useSound } from "@/components/providers/SoundProvider";
import GhostMap from "@/components/features/GhostMap";
import Leaderboard from "@/components/features/Leaderboard";
import GlobalRadio from "@/components/features/GlobalRadio";
import CampusHeatmap from "@/components/features/CampusHeatmap";

export default function SidebarNav() {
    const pathname = usePathname();
    const { toggleNightMode, isNight } = useTime();
    const { playHover, playClick, playSwitch } = useSound();

    const links = [
        { href: "/", label: "Common Room", icon: Home },
        { href: "/rituals", label: "Weekly Rituals", icon: Sparkles },
        { href: "/classifieds", label: "Classifieds", icon: Newspaper },
    ];

    return (
        <div className="flex flex-col h-full bg-transparent transition-colors duration-500">
            {/* Header */}
            <div className="p-6 pb-2">
                <div className="px-3">
                    <h1 className="text-3xl font-serif italic tracking-tight select-none" style={{ color: 'var(--foreground)' }}>Blud.</h1>
                </div>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8 scrollbar-hide">
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => playClick()}
                                onMouseEnter={() => playHover()}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:translate-x-1 relative overflow-hidden",
                                    isActive
                                        ? "bg-blud-orange/10 text-blud-orange font-bold"
                                        : "hover:bg-blud-blue/5 text-blud-blue/60"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blud-orange rounded-r-full" />
                                )}
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-transform group-hover:scale-110 duration-300", isActive && "scale-110")} />
                                <span className={cn("text-base font-medium transition-all group-hover:translate-x-0.5", isActive && "font-bold")}>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Left Side Widgets (New) */}
                <div className="space-y-4 pt-4 border-t border-blud-blue/5">
                    <GlobalRadio />
                    <GhostMap />
                    <Leaderboard />
                </div>
            </div>

            <div className="space-y-2 border-t border-blud-blue/10 pt-6">
                <button
                    onClick={() => {
                        playSwitch();
                        toggleNightMode();
                    }}
                    onMouseEnter={() => playHover()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-blud-blue/40 hover:bg-blud-blue/5 hover:text-blud-blue transition-colors w-full text-left"
                >
                    <Settings size={20} />
                    <span className="text-base font-medium" suppressHydrationWarning>{isNight ? "Day Mode" : "Night Mode"}</span>
                </button>
            </div>
        </div>
    );
}
