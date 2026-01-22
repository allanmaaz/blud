"use client";

import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CampusVibeCheck() {
    const [vibe, setVibe] = useState("\"Library is strictly silent but Coffee House is playing 90s jazz. Architecture students are stressed about the 4pm review. General mood: Caffeinated Panic.\"");
    const [loading, setLoading] = useState(false);

    const refreshVibe = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/generate-vibe', { method: 'POST' });
            const data = await res.json();
            if (data.vibe) {
                setVibe(data.vibe);
            }
        } catch (e) {
            console.error("Failed to refresh vibe", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-blud-blue/8 via-blud-accent/5 to-transparent border-blud-blue/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blud-orange/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <motion.div 
                            className="p-2 rounded-xl bg-gradient-to-br from-blud-blue to-blud-blue/80 text-blud-cream shadow-lg"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Sparkles size={16} fill="currentColor" />
                        </motion.div>
                        <div>
                            <h3 className="font-serif text-blud-blue text-xl font-bold">Campus Vibe Check</h3>
                            <p className="text-xs text-blud-blue/50 font-medium">Real-time mood</p>
                        </div>
                    </div>
                    <motion.span 
                        className="text-[10px] uppercase tracking-wider font-bold text-blud-blue/60 bg-white/70 px-3 py-1.5 rounded-full border border-blud-blue/20 shadow-sm"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        Live
                    </motion.span>
                </div>

                <div className="space-y-5">
                    <motion.div
                        key={vibe}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-blud-blue/85 font-serif text-lg leading-relaxed min-h-[100px] italic">
                            "{vibe}"
                        </p>
                    </motion.div>

                    <div className="flex gap-2 flex-wrap text-xs">
                        <span className="px-3 py-1.5 rounded-full bg-white/60 border border-blud-blue/20 text-blud-blue/70 font-medium hover:bg-white/80 hover:border-blud-blue/30 transition-all cursor-pointer">#studying</span>
                        <span className="px-3 py-1.5 rounded-full bg-white/60 border border-blud-blue/20 text-blud-blue/70 font-medium hover:bg-white/80 hover:border-blud-blue/30 transition-all cursor-pointer">#jazz</span>
                        <span className="px-3 py-1.5 rounded-full bg-white/60 border border-blud-blue/20 text-blud-blue/70 font-medium hover:bg-white/80 hover:border-blud-blue/30 transition-all cursor-pointer">#reviews</span>
                    </div>

                    <div className="pt-3 border-t-2 border-blud-blue/10 flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-9 px-4 font-semibold"
                            onClick={refreshVibe}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="mr-2 animate-spin" />
                                    Listening...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={14} className="mr-2" />
                                    Refresh Vibe
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
