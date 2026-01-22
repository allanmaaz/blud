"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, User, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";

export default function BottomNav() {
    const pathname = usePathname();
    const { playClick, playHover } = useSound();

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/classifieds", label: "Classifieds", icon: Newspaper },
        { href: "/rituals", label: "Rituals", icon: Sparkles },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center p-6 pointer-events-none md:hidden">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
                className="flex items-center gap-2 rounded-full border border-blud-blue/10 bg-blud-cream/80 backdrop-blur-xl px-6 py-2 shadow-xl shadow-blud-blue/10 pointer-events-auto"
            >
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => playClick()}
                            className="relative"
                        >
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onMouseEnter={() => playHover()}
                                className={cn(
                                    "p-3 rounded-full transition-all duration-300 relative",
                                    isActive ? "text-blud-blue" : "text-blud-blue/40"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavBubble"
                                        className="absolute inset-0 bg-blud-blue/10 rounded-full"
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                                <span className="sr-only">{link.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
}
