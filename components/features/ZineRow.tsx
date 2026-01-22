"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles } from "lucide-react";

// Mock zines with enhanced data
const zines = [
    { id: 1, title: "Coffee & Rain", author: "Barista Club", color: "bg-gradient-to-br from-orange-200 to-orange-300", readers: 234 },
    { id: 2, title: "brutalism.pdf", author: "Arch Studio", color: "bg-gradient-to-br from-stone-300 to-stone-400", readers: 189 },
    { id: 3, title: "Midnight Oil", author: "Library Staff", color: "bg-gradient-to-br from-indigo-300 to-indigo-400", readers: 312 },
    { id: 4, title: "Lost Gloves", author: "Found Art", color: "bg-gradient-to-br from-pink-200 to-pink-300", readers: 156 },
];

export default function ZineRow() {
    return (
        <div className="py-6 space-y-5 overflow-hidden">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl text-blud-blue font-semibold">Fresh Zines</h2>
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <Sparkles size={18} className="text-blud-orange" />
                    </motion.div>
                </div>
                <button className="text-xs font-sans font-semibold text-blud-blue/70 hover:text-blud-blue uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                    View All 
                    <span className="text-base">→</span>
                </button>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory px-1 no-scrollbar -mx-4 md:mx-0 px-4 md:px-0">
                {zines.map((zine, idx) => (
                    <motion.div
                        key={zine.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="snap-center shrink-0 w-36 aspect-[3/4] relative cursor-pointer group"
                        whileHover={{ y: -8, rotate: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => console.log(`Opening zine: ${zine.title}`)}
                    >
                        <div className={cn(
                            "w-full h-full rounded-2xl border-2 border-blud-blue/15 shadow-lg p-4 flex flex-col justify-between transition-all group-hover:shadow-2xl group-hover:border-blud-blue/30 bg-white/60 backdrop-blur-sm",
                            zine.color
                        )}>
                            <div className="space-y-3">
                                <div className="w-full h-20 rounded-xl border-2 border-blud-blue/20 border-dashed opacity-60 flex items-center justify-center">
                                    <BookOpen size={24} className="text-blud-blue/30" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-base font-bold leading-tight text-blud-blue mb-1 line-clamp-2">{zine.title}</h3>
                                    <p className="font-sans text-[10px] font-medium uppercase tracking-wider text-blud-blue/60">{zine.author}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-blud-blue/50 border-t border-blud-blue/20 pt-2">
                                <div className="flex items-center gap-1">
                                    <BookOpen size={12} />
                                    <span className="font-medium">{zine.readers}</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold group-hover:text-blud-orange transition-colors">Read →</span>
                            </div>
                        </div>
                        {/* Layered page effect */}
                        <div className="absolute top-1 right-1 w-full h-full bg-blud-blue/5 rounded-2xl -z-10 rotate-2 group-hover:rotate-4 transition-transform origin-bottom-right border border-blud-blue/10"></div>
                        <div className="absolute top-2 right-2 w-full h-full bg-blud-blue/3 rounded-2xl -z-20 rotate-1 group-hover:rotate-2 transition-transform origin-bottom-right"></div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
