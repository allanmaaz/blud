"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import webSocketService from "@/lib/websocket-service";

export default function CampusHeatmap() {
    const [zones, setZones] = useState(() => {
        const hour = new Date().getHours();

        // Define "Hotspots" for different times
        // 0-63 grid indices
        let activeIndices: number[] = [];

        if (hour >= 8 && hour < 12) {
            // Morning Classes (Clusters in top/left)
            activeIndices = [0, 1, 2, 8, 9, 10, 16, 17, 18];
        } else if (hour >= 12 && hour < 14) {
            // Lunch Rush (Center mass)
            activeIndices = [27, 28, 29, 35, 36, 37, 43, 44, 45, 20, 21];
        } else if (hour >= 18 && hour < 22) {
            // Evening Social (Bottom right)
            activeIndices = [53, 54, 55, 61, 62, 63];
        } else if (hour >= 22 || hour < 4) {
            // Late Night Studio (Scattered isolated lights)
            activeIndices = [4, 15, 42, 60, 22];
        } else {
            // General scattered flow
            activeIndices = [10, 20, 30, 40, 50];
        }

        return Array.from({ length: 64 }).map((_, i) => {
            const isHotspot = activeIndices.includes(i) || activeIndices.some(h => Math.abs(h - i) === 1); // Exact match or neighbor

            // Add some noise so it's not a perfect block
            const noise = Math.random();
            const activityLevel = isHotspot
                ? 0.7 + (noise * 0.3) // High activity (0.7 - 1.0)
                : noise * 0.3;        // Low activity (0.0 - 0.3)

            return {
                id: i,
                activity: activityLevel,
                delay: Math.random() * 2,
                duration: 2 + Math.random() * 2
            };
        });
    });

    useEffect(() => {
        // Subscribe to live heatmap data
        // Expecting data: { id: number, activity: number }
        const subscription = webSocketService.subscribe('/topic/heatmap', (data: unknown) => {
            const typedData = data as { id: number, activity: number };
            setZones(prevZones => prevZones.map(zone => {
                if (zone.id === typedData.id) {
                    return { ...zone, activity: typedData.activity };
                }
                return zone;
            }));
        });
        return () => { subscription.unsubscribe(); };
    }, []);

    return (
        <div className="w-full aspect-square bg-blud-blue/5 rounded-2xl border border-blud-blue/10 p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="font-serif text-lg text-blud-blue">Campus Heatmap</h3>
                <p className="text-xs text-blud-blue/50 uppercase tracking-widest">
                    Live • {new Date().getHours() >= 22 || new Date().getHours() < 5 ? "Late Shift" : "Active"}
                </p>
            </div>

            <div className="grid grid-cols-8 gap-1 h-full w-full rotate-45 scale-125 opacity-80 mix-blend-multiply">
                {zones.map((zone) => (
                    <motion.div
                        key={zone.id}
                        initial={{ opacity: 0.2 }}
                        animate={{
                            opacity: [0.2, 0.4 + zone.activity * 0.6, 0.2],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: zone.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: zone.delay
                        }}
                        className={cn(
                            "rounded-sm transition-colors duration-1000",
                            zone.activity > 0.6 ? "bg-blud-orange" : "bg-blud-blue"
                        )}
                    />
                ))}
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-3 text-[10px] bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm border border-blud-blue/5">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blud-blue opacity-30"></div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blud-orange"></div>
                </div>
            </div>
        </div>
    );
}
