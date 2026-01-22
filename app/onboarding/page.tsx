"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        handle: "",
        major: "",
        dorm: ""
    });

    const handleComplete = async () => {
        setLoading(true);
        // Get user from local storage (set during login)
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return router.push("/login");

        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...formData };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            });

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(await res.json()));
                router.push("/");
            } else {
                console.error("Failed to save profile");
                // TODO: Show proper error toast/notification
            }
        } catch (e) {
            console.error("Profile update error:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-blud-base">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-md"
            >
                <div className="mb-8">
                    <span className="bg-blud-orange/10 text-blud-orange font-mono text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                        Step {step} of 3
                    </span>
                    <h1 className="text-3xl font-serif text-blud-blue mt-4">
                        {step === 1 && "Pick your Handle."}
                        {step === 2 && "What are you studying?"}
                        {step === 3 && "Where are you staying?"}
                    </h1>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blud-blue/40 font-mono text-lg">@</span>
                            <input
                                autoFocus
                                value={formData.handle}
                                onChange={e => setFormData({ ...formData, handle: e.target.value })}
                                className="w-full bg-white border-none rounded-2xl py-6 pl-10 pr-6 text-2xl font-bold text-blud-blue placeholder:text-blud-blue/10 focus:ring-0 outline-none shadow-sm"
                                placeholder="username"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <input
                            autoFocus
                            value={formData.major}
                            onChange={e => setFormData({ ...formData, major: e.target.value })}
                            className="w-full bg-white border-none rounded-2xl py-6 px-6 text-2xl font-bold text-blud-blue placeholder:text-blud-blue/10 focus:ring-0 outline-none shadow-sm"
                            placeholder="e.g. Architecture"
                        />
                    )}

                    {step === 3 && (
                        <input
                            autoFocus
                            value={formData.dorm}
                            onChange={e => setFormData({ ...formData, dorm: e.target.value })}
                            className="w-full bg-white border-none rounded-2xl py-6 px-6 text-2xl font-bold text-blud-blue placeholder:text-blud-blue/10 focus:ring-0 outline-none shadow-sm"
                            placeholder="e.g. North Hall"
                        />
                    )}

                    <button
                        onClick={() => {
                            if (step < 3) setStep(step + 1);
                            else handleComplete();
                        }}
                        disabled={loading || (step === 1 && !formData.handle) || (step === 2 && !formData.major) || (step === 3 && !formData.dorm)}
                        className="w-full bg-blud-blue text-white font-bold py-4 rounded-xl disabled:opacity-50 shadow-lg shadow-blud-blue/20 flex items-center justify-center gap-2"
                    >
                        {step === 3 ? (loading ? "Finalizing..." : "Complete Setup") : "Next"}
                        {step === 3 ? <Check size={18} /> : <ArrowRight size={18} />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
