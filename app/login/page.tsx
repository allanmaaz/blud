"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blud-cream via-blud-cream to-blud-orange/10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blud-blue/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-serif italic text-blud-blue mb-2">Blud.</h1>
                        <p className="text-blud-blue/60">Campus Common Room</p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blud-blue/30 hover:shadow-lg transition-all duration-300 group"
                        >
                            <FcGoogle className="text-2xl" />
                            <span className="font-medium text-gray-700 group-hover:text-blud-blue transition-colors">
                                Continue with Google
                            </span>
                        </button>

                        <button
                            onClick={() => signIn("github", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                        >
                            <Github className="text-white text-xl" />
                            <span className="font-medium text-white">
                                Continue with GitHub
                            </span>
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-blud-blue/40 mt-8">
                        University email required
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
