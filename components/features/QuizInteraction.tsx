"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, BrainCircuit, Trophy } from "lucide-react";
import { useSound } from "@/components/providers/SoundProvider";
import { cn } from "@/lib/utils";

interface Post {
    id: number;
    options?: string[];
    correctAnswer?: number;
}

export default function QuizInteraction({ post }: { post: Post }) {
    const { playSuccess, playError, playClick } = useSound();
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSelect = async (index: number) => {
        if (submitted) return;

        setSelected(index);
        setSubmitted(true);

        const correct = index === post.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            playSuccess();
            // Fire and forget score update
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                if (user.email) {
                    const res = await fetch("http://localhost:8080/api/stats/score", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email, correct: true })
                    });

                    if (res.ok) {
                        const updatedUser = await res.json();
                        // Update local storage so Profile Card sees it
                        localStorage.setItem("user", JSON.stringify({ ...updatedUser, email: user.email }));
                        // Dispatch event to notify StudentIdCard to re-render
                        window.dispatchEvent(new Event("blud-user-update"));
                    }
                }
            } catch (e) {
                console.error("Failed to update score", e);
            }
        } else {
            playError();
        }
    };

    return (
        <div className="mt-4 space-y-2">
            {!submitted && (
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blud-orange/80 uppercase tracking-widest">
                    <BrainCircuit size={14} className="animate-pulse" />
                    Neuro-Link Active
                </div>
            )}

            <div className="grid grid-cols-1 gap-2">
                {post.options?.map((option, index) => {
                    const isSelected = selected === index;
                    const isTheCorrectAnswer = index === post.correctAnswer;

                    // Styles
                    let bgClass = "bg-blud-blue/5 hover:bg-blud-blue/10 border-transparent";
                    let textClass = "text-blud-blue/80";

                    if (submitted) {
                        if (isTheCorrectAnswer) {
                            bgClass = "bg-green-500/10 border-green-500/50";
                            textClass = "text-green-600 font-bold";
                        } else if (isSelected && !isCorrect) {
                            bgClass = "bg-red-500/10 border-red-500/50";
                            textClass = "text-red-600 font-medium line-through decoration-red-500/50";
                        } else {
                            bgClass = "opacity-50";
                        }
                    }

                    return (
                        <motion.button
                            key={index}
                            onClick={() => !submitted && handleSelect(index)}
                            onMouseEnter={() => !submitted && playClick()}
                            className={cn(
                                "relative w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between group",
                                bgClass,
                                textClass
                            )}
                            whileHover={!submitted ? { scale: 1.02, x: 4 } : {}}
                            whileTap={!submitted ? { scale: 0.98 } : {}}
                        >
                            <span className="flex items-center gap-3">
                                <span className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors",
                                    submitted && isTheCorrectAnswer ? "bg-green-500 text-white border-green-500" :
                                        submitted && isSelected && !isCorrect ? "bg-red-500 text-white border-red-500" :
                                            "border-blud-blue/20 text-blud-blue/40 group-hover:border-blud-blue/50 group-hover:text-blud-blue"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </span>

                            {submitted && isTheCorrectAnswer && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-green-500"
                                >
                                    <Check size={18} strokeWidth={3} />
                                </motion.div>
                            )}

                            {submitted && isSelected && !isCorrect && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-red-500"
                                >
                                    <X size={18} strokeWidth={3} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {submitted && isCorrect && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 p-3 bg-green-500/10 rounded-lg flex items-center justify-between border border-green-500/20">
                            <span className="text-sm font-medium text-green-700 flex items-center gap-2">
                                <Trophy size={16} />
                                Correct! +2 XP
                            </span>
                            <span className="text-[10px] text-green-600/60 font-mono">
                                DORM RANK UPDATED
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
