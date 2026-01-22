"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Trophy, TrendingUp, Users } from "lucide-react";

interface DormStat {
    name: string;
    score: number;
}

export default function Leaderboard() {
    const [stats, setStats] = useState<DormStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/dorms`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Poll every 10 seconds for updates
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="bg-[#111113] border-white/5 overflow-hidden font-sans">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy className="text-blud-orange" size={18} />
                    <h3 className="text-white/90 font-bold tracking-tight">Dorm Dominion</h3>
                </div>
                <span className="text-[10px] bg-blud-orange/10 text-blud-orange px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Season 1
                </span>
            </div>

            <div className="p-2 space-y-1">
                {loading ? (
                    <div className="p-4 text-center text-white/20 text-xs animate-pulse">Syncing mainframe...</div>
                ) : (
                    <AnimatePresence>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.name}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors relative overflow-hidden"
                            >
                                <div className="w-8 text-center font-serif font-bold text-white/30 group-hover:text-blud-orange transition-colors">
                                    #{index + 1}
                                </div>

                                <div className="flex-1 px-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-white/90">{stat.name}</span>
                                        <span className="text-xs font-bold text-blud-orange">{stat.score}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.score}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-blud-orange to-blud-orange/50"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {stats.length === 0 && !loading && (
                            <div className="p-8 text-center">
                                <Users className="mx-auto text-white/10 mb-2" size={32} />
                                <p className="text-xs text-white/30">No active dorms yet.<br />Be the first to update your profile.</p>
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </Card>
    );
}
