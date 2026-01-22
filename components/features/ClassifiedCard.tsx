
"use client";

import { cn } from "@/lib/utils";

export interface ClassifiedCardProps {
    category: "LOST" | "FOUND" | "WANTED" | "FOR SALE" | "MISC";
    title: string;
    description: string;
    contact: string;
    className?: string;
}

export default function ClassifiedCard({ category, title, description, contact, className }: ClassifiedCardProps) {
    return (
        <div className={cn("border-2 border-blud-blue p-4 bg-blud-cream text-blud-blue font-mono break-words", className)}>
            <div className="border-b-2 border-blud-blue pb-2 mb-3 flex justify-between items-baseline">
                <span className="font-bold text-lg uppercase tracking-wider">{category}</span>
                <span className="text-xs opacity-60">14 OCT</span>
            </div>

            <h3 className="font-bold text-xl mb-2 leading-tight uppercase">{title}</h3>
            <p className="text-sm leading-relaxed opacity-90 mb-4">{description}</p>

            <div className="text-xs uppercase tracking-widest opacity-60 bg-blud-blue/5 p-1 inline-block">
                Contact: {contact}
            </div>
        </div>
    );
}
