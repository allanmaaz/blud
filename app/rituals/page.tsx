"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check } from "lucide-react";
import { useSound } from "@/components/providers/SoundProvider";

export default function RitualsPage() {
    const [hasParticipated, setHasParticipated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contribution, setContribution] = useState("");
    const { playSuccess, playClick } = useSound();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contribution) return;

        playClick();
        setIsSubmitting(true);

        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false);
            setHasParticipated(true);
            playSuccess();
        }, 1500);
    };

    return (
        <div className="max-w-md mx-auto p-6 space-y-8 pt-12 pb-32">
            <header className="space-y-2">
                <h1 className="text-4xl text-blud-blue font-serif">Weekly Rituals</h1>
                <p className="text-blud-blue/60 font-sans">Low-effort prompts to keep us connected.</p>
            </header>

            <AnimatePresence mode="wait">
                {!hasParticipated ? (
                    <Card key="prompt" className="bg-blud-blue/5 border-blud-blue/20 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-start">
                                <span className="inline-block px-3 py-1 rounded-full border border-blud-blue/20 text-xs font-medium uppercase tracking-wider text-blud-blue">Active Now</span>
                                <span className="text-xs text-blud-blue/40">Ends in 2 days</span>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif text-blud-blue leading-tight">What are you reading right now?</h2>
                                <p className="text-base text-blud-blue/70">Snap a photo of page 14 or just drop the title.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <textarea
                                    value={contribution}
                                    onChange={(e) => setContribution(e.target.value)}
                                    placeholder="I'm reading..."
                                    className="w-full bg-white/50 backdrop-blur-sm rounded-xl border border-blud-blue/10 p-4 text-blud-blue placeholder:text-blud-blue/30 focus:outline-none focus:border-blud-blue/30 focus:ring-2 focus:ring-blud-blue/5 transition-all resize-none min-h-[100px]"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0"
                                        onClick={() => playClick()}
                                    >
                                        <Camera size={20} />
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting || !contribution}
                                    >
                                        {isSubmitting ? "Posting..." : "Participate"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </Card>
                ) : (
                    <Card key="success" className="bg-green-500/10 border-green-500/20 flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring" }}
                            className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20"
                        >
                            <Check size={32} strokeWidth={3} />
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-serif text-blud-blue font-bold">You're in the loop.</h2>
                            <p className="text-sm text-blud-blue/60 mt-1">Check back later to see what others shared.</p>
                        </motion.div>
                        <Button variant="ghost" className="mt-4" onClick={() => setHasParticipated(false)}>
                            Edit Response
                        </Button>
                    </Card>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <h3 className="text-lg font-serif text-blud-blue/80 border-b border-blud-blue/10 pb-2">Past Rituals</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="aspect-square flex flex-col justify-end p-4 bg-blud-cream/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <span className="text-xs text-blud-blue/40 uppercase mb-1">Last Week</span>
                        <h3 className="font-serif text-lg text-blud-blue leading-tight">Best study spots</h3>
                    </Card>
                    <Card className="aspect-square flex flex-col justify-end p-4 bg-blud-cream/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <span className="text-xs text-blud-blue/40 uppercase mb-1">Archive</span>
                        <h3 className="font-serif text-lg text-blud-blue leading-tight">Exam playlists</h3>
                    </Card>
                </div>
            </div>
        </div>
    );
}
