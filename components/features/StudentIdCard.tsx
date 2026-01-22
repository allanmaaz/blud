"use client";

import { motion } from "framer-motion";
import { Share2, Copy, MoreHorizontal, Calendar, CreditCard, MapPin, Code, Edit2, Check, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

export default function StudentIdCard() {
    const { playClick, playHover, playSwitch, playSuccess } = useSound();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [data, setData] = useState({
        name: "Daniel Jackson",
        handle: "DanielJackson",
        birth: "28. Sep. 1990",
        id: "CS2463.DT",
        location: "California, USA",
        position: "Frontend Dev.",
        productivity: "67",
        success: "85",
        avatar: "/avatar_3d.png",
        email: "" // Need email to identifying user in prototype backend
    });

    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    setData(prev => ({
                        ...prev,
                        name: user.name || prev.name,
                        handle: user.handle || prev.handle,
                        location: user.dorm || prev.location,
                        position: user.major || prev.position,
                        avatar: user.avatar || prev.avatar,
                        email: user.email || "",
                        birth: user.birthDate || prev.birth,
                        productivity: user.productivity || prev.productivity,
                        success: user.successRate || prev.success,
                        id: user.id ? `ID.${user.id}` : prev.id
                    }));
                } catch (e) {
                    console.error("Failed to parse user", e);
                }
            }
        };

        loadUser();

        // Listen for updates from Quiz wins
        window.addEventListener("blud-user-update", loadUser);
        return () => window.removeEventListener("blud-user-update", loadUser);
    }, []);

    const handleSave = async () => {
        if (!data.email) {
            // If no user is logged in, just save locally in state for demo
            playSuccess();
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            // Persist to backend
            const payload = {
                email: data.email,
                name: data.name,
                handle: data.handle,
                major: data.position, // Mapping frontend 'position' to backend 'major'
                dorm: data.location,  // Mapping frontend 'location' to backend 'dorm'
                avatar: data.avatar,
                birthDate: data.birth,
                productivity: data.productivity,
                successRate: data.success
            };

            const res = await fetch("http://localhost:8080/api/auth/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                // Update local storage to keep it in sync
                localStorage.setItem("user", JSON.stringify({ ...updatedUser, email: data.email })); // Ensure email persists
                playSuccess();
                setIsEditing(false);
            } else {
                console.error("Failed to save profile");
                // playError() // if sound existed
            }
        } catch (error) {
            console.error("Network error", error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEdit = () => {
        playSwitch();
        if (isEditing) handleSave();
        else setIsEditing(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({ ...prev, avatar: reader.result as string }));
                playSuccess();
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerImageUpload = () => {
        if (isEditing) {
            playClick();
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="w-full max-w-xs mx-auto perspective-1000 font-sans group">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            <motion.div
                initial={{ rotateY: 10, opacity: 0, scale: 0.95 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full bg-[#09090b] rounded-[40px] overflow-hidden shadow-2xl border border-white/5 transition-transform duration-500 ease-out group-hover:rotate-y-2 group-hover:scale-[1.02]"
            >
                {/* Header Background - Vibrant Brand Orange (Fixed) */}
                <div className="h-[340px] bg-[#FF5722] relative rounded-t-[40px] overflow-hidden transition-colors duration-300">
                    {/* Noise texture overlay for texture */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

                    {/* Top Right Cutout/Button Area */}
                    <div className="absolute top-0 right-0 w-24 h-24 z-20">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button
                                onClick={() => playClick()}
                                onMouseEnter={() => playHover()}
                                className="p-2 text-black/20 hover:text-black transition-colors"
                            >
                                <MoreHorizontal size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Avatar Image - Centered and Large */}
                    <div className="absolute inset-x-0 bottom-0 top-12 flex justify-center items-end z-10">
                        <div
                            className={cn(
                                "relative transition-all duration-300",
                                isEditing ? "cursor-pointer hover:scale-105" : ""
                            )}
                            onClick={triggerImageUpload}
                            onMouseEnter={() => isEditing && playHover()}
                        >
                            <motion.img
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                src={data.avatar}
                                alt="Profile"
                                className="w-64 h-64 object-cover object-top"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                                }}
                            />

                            {/* Edit Overlay */}
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-t-full mask-gradient"
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                                    }}
                                >
                                    <Camera className="text-white drop-shadow-lg" size={48} />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dark Info Card Overlay */}
                <div className="relative z-20 mx-4 -mt-16 bg-[#111113] rounded-[32px] p-6 shadow-2xl border border-white/5 backdrop-blur-sm">
                    {/* Name Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex-1 mr-2">
                            {isEditing ? (
                                <input
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="bg-transparent text-xl font-bold text-white/90 w-full focus:outline-none focus:border-b border-[#FF5722]"
                                    placeholder="Your Name"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-white/90 truncate">{data.name}</h2>
                            )}

                            {isEditing ? (
                                <input
                                    value={data.handle}
                                    onChange={(e) => setData({ ...data, handle: e.target.value })}
                                    className="bg-transparent text-sm text-[#FF5722] w-full focus:outline-none focus:border-b border-[#FF5722] mt-1"
                                    placeholder="@handle"
                                />
                            ) : (
                                <p className="text-sm text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-4 truncate">@{data.handle}</p>
                            )}
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => playClick()}
                                onMouseEnter={() => playHover()}
                                className="w-10 h-10 rounded-full bg-[#1A1A1D] flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"
                            >
                                <Share2 size={16} />
                            </button>
                            <button
                                onClick={toggleEdit}
                                disabled={isSaving}
                                onMouseEnter={() => playHover()}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-white/5",
                                    isEditing ? "bg-[#FF5722] text-white" : "bg-[#1A1A1D] text-white/40 hover:text-white",
                                    isSaving && "opacity-50 cursor-wait"
                                )}
                            >
                                {isSaving ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                                    />
                                ) : (
                                    isEditing ? <Check size={16} /> : <Edit2 size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Stats Rings */}
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-3">
                            {/* Ring 1 - Productivity */}
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                                    <motion.path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#FF5722"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: parseInt(data.productivity) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/40 font-medium">Productivity</span>
                                {isEditing ? (
                                    <div className="flex items-center">
                                        <input
                                            value={data.productivity}
                                            onChange={(e) => setData({ ...data, productivity: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                            className="w-8 bg-transparent text-sm font-bold text-white/90 focus:outline-none border-b border-[#FF5722]"
                                        />
                                        <span className="text-sm font-bold text-white/90">%</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-bold text-white/90">{data.productivity}%</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Ring 2 - Success */}
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                                    <motion.path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#FF5722"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: parseInt(data.success) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/40 font-medium">Success</span>
                                {isEditing ? (
                                    <div className="flex items-center">
                                        <input
                                            value={data.success}
                                            onChange={(e) => setData({ ...data, success: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                            className="w-8 bg-transparent text-sm font-bold text-white/90 focus:outline-none border-b border-[#FF5722]"
                                        />
                                        <span className="text-sm font-bold text-white/90">%</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-bold text-white/90">{data.success}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Details Section */}
                <div className="px-8 pb-10 pt-6 bg-[#09090b]">
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-medium tracking-wide">
                                <Calendar size={12} /> Birth
                            </div>
                            {isEditing ? (
                                <input value={data.birth} onChange={(e) => setData({ ...data, birth: e.target.value })} className="bg-transparent border-b border-[#FF5722] text-gray-300 font-medium text-sm w-full focus:outline-none" />
                            ) : (
                                <div className="text-gray-300 text-sm font-medium truncate">{data.birth}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-medium tracking-wide">
                                <CreditCard size={12} /> ID Number
                            </div>
                            {isEditing ? (
                                <input value={data.id} onChange={(e) => setData({ ...data, id: e.target.value })} className="bg-transparent border-b border-[#FF5722] text-gray-300 font-medium text-sm w-full focus:outline-none" />
                            ) : (
                                <div className="text-gray-300 text-sm font-medium truncate">{data.id}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-medium tracking-wide">
                                <MapPin size={12} /> Location
                            </div>
                            {isEditing ? (
                                <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} className="bg-transparent border-b border-[#FF5722] text-gray-300 font-medium text-sm w-full focus:outline-none" />
                            ) : (
                                <div className="text-gray-300 text-sm font-medium truncate">{data.location}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-medium tracking-wide">
                                <Code size={12} /> Position
                            </div>
                            {isEditing ? (
                                <input value={data.position} onChange={(e) => setData({ ...data, position: e.target.value })} className="bg-transparent border-b border-[#FF5722] text-gray-300 font-medium text-sm w-full focus:outline-none" />
                            ) : (
                                <div className="text-gray-300 text-sm font-medium truncate">{data.position}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <MoreHorizontal
                            className="text-white/10 hover:text-white/30 transition-colors cursor-pointer"
                            size={20}
                            onMouseEnter={() => playHover()}
                            onClick={() => playClick()}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
