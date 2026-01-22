"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
        // Call backend (Mocking API call here for prototype speed, pointing to localhost:8080)

        try {
            const res = await fetch(`http://localhost:8080${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const user = await res.json();
                // Store user (Simple localStorage for prototype)
                localStorage.setItem("user", JSON.stringify(user));

                if (isLogin) {
                    // Check if profile is complete (e.g., if handle exists)
                    if (user.handle) {
                        router.push("/");
                    } else {
                        router.push("/onboarding");
                    }
                } else {
                    router.push("/onboarding");
                }
            } else {
                console.error("Auth failed");
                // TODO: Show proper error toast/notification
            }
        } catch (err) {
            console.error("Backend connection failed:", err);
            // TODO: Show proper error toast/notification
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blud-cream via-blud-cream to-blud-accent/10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <motion.div 
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-6xl font-serif text-blud-blue tracking-tight mb-3 font-bold">Blud</h1>
                    <p className="text-blud-blue/60 font-sans text-sm font-medium tracking-wide">
                        {isLogin ? "Welcome back to campus" : "Join your campus community"}
                    </p>
                </motion.div>

                <Card className="p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-blud-blue/40 uppercase tracking-wider pl-1">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blud-blue/30" size={16} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-blud-blue/5 border-none rounded-xl py-3 pl-10 pr-4 text-blud-blue font-medium focus:ring-2 focus:ring-blud-orange/50 outline-none"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blud-blue/40 uppercase tracking-wider pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blud-blue/30" size={16} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-blud-blue/5 border-none rounded-xl py-3 pl-10 pr-4 text-blud-blue font-medium focus:ring-2 focus:ring-blud-orange/50 outline-none"
                                    placeholder="student@uni.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blud-blue/40 uppercase tracking-wider pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blud-blue/30" size={16} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-blud-blue/5 border-none rounded-xl py-3 pl-10 pr-4 text-blud-blue font-medium focus:ring-2 focus:ring-blud-orange/50 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blud-blue to-blud-blue/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blud-blue/30 hover:shadow-2xl hover:shadow-blud-blue/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Processing...
                                </motion.span>
                            ) : (
                                <>
                                    {isLogin ? "Enter Campus" : "Create ID"}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-blud-blue/60">
                            {isLogin ? "New here?" : "Already have an ID?"}{" "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blud-orange font-bold hover:underline"
                            >
                                {isLogin ? "Apply Now" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
