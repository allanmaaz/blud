"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import webSocketService from "@/lib/websocket-service";

interface HeatmapUpdate {
    id: number;
    activity: number;
}

export default function GhostMap() {
    const [zones, setZones] = useState<Record<number, number>>({});

    // Grid of 64 zones (8x8)
    const gridIds = Array.from({ length: 64 }, (_, i) => i);

    useEffect(() => {
        const unsubscribe = webSocketService.subscribe('/topic/heatmap', (data: unknown) => {
            const update = data as HeatmapUpdate;
            setZones(prev => ({
                ...prev,
                [update.id]: update.activity
            }));

            // Fade out effect - remove activity after 3 seconds
            setTimeout(() => {
                setZones(prev => {
                    const next = { ...prev };
                    if (next[update.id] === update.activity) {
                        delete next[update.id];
                    }
                    return next;
                });
            }, 2000);
        });

        return () => {
            unsubscribe.unsubscribe();
        };
    }, []);

    return (
        <Card className="p-0 overflow-hidden relative border-none bg-black/40 backdrop-blur-md">
            <div className="absolute inset-0 z-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>

            <div className="p-4 border-b border-white/5 flex justify-between items-center relative z-10">
                <h3 className="text-white/80 font-serif tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse box-shadow-green"></span>
                    Ghost Map
                </h3>
                <span className="text-xs text-white/30 font-mono">LIVE FEED</span>
            </div>

            <div className="p-6 relative z-10">
                <div className="grid grid-cols-8 gap-1 w-full aspect-square max-w-[300px] mx-auto">
                    {gridIds.map((id) => {
                        const activity = zones[id] || 0;
                        return (
                            <div
                                key={id}
                                className="relative rounded-sm bg-white/5 overflow-hidden transition-colors duration-500"
                                style={{
                                    backgroundColor: activity > 0 ? `rgba(255, 87, 34, ${0.1 + activity * 0.5})` : 'rgba(255, 255, 255, 0.03)'
                                }}
                            >
                                <AnimatePresence>
                                    {activity > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.5 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 bg-[#FF5722] blur-md"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="px-4 py-2 bg-black/20 text-[10px] text-white/20 text-center font-mono uppercase tracking-widest relative z-10">
                Sector 7 Active
            </div>
        </Card>
    );
}
