"use client";

import { Card } from "./Card";
import CampusHeatmap from "@/components/features/CampusHeatmap";

export default function Widgets() {
    return (
        <div className="flex flex-col gap-6 p-6 h-full">
            {/* Calendar Widget */}
            <Card className="border-blud-blue/20 bg-blud-blue/5">
                <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-blud-blue/60 font-medium">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}
                    </span>
                    <span className="font-serif text-blud-blue text-lg">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                        <div className="text-xs font-mono text-blud-blue/40 mt-1">10:00</div>
                        <div>
                            <p className="text-sm font-medium text-blud-blue">Architecture Review</p>
                            <p className="text-xs text-blud-blue/60">North Hall Studio 4</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="text-xs font-mono text-blud-blue/40 mt-1">14:00</div>
                        <div>
                            <p className="text-sm font-medium text-blud-blue">Coffee with Jamie</p>
                            <p className="text-xs text-blud-blue/60">The Roastery</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* <CampusHeatmap /> removed (moved to Sidebar) */}

            {/* Footer */}
            <div className="mt-auto pt-6 text-[10px] text-blud-blue/30 text-center uppercase tracking-widest">
                Blud © 2024 • University Only
            </div>
        </div>
    );
}
