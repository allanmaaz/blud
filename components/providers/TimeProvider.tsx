"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TimeContextType = {
    isNight: boolean;
    toggleNightMode: () => void;
};

const TimeContext = createContext<TimeContextType>({
    isNight: false,
    toggleNightMode: () => { },
});

export const useTime = () => useContext(TimeContext);

export default function TimeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isNight, setIsNight] = useState(() => {
        // Check if running on client
        if (typeof window !== 'undefined') {
            const hour = new Date().getHours();
            return hour >= 19 || hour < 6;
        }
        return false;
    });

    // Effect only needed if we want to update it periodically, but for now initial static check is fine.
    // We keep the effect to sync the attribute.

    useEffect(() => {
        if (isNight) {
            document.body.setAttribute("data-mode", "night");
        } else {
            document.body.removeAttribute("data-mode");
        }
    }, [isNight]);

    return (
        <TimeContext.Provider value={{ isNight, toggleNightMode: () => setIsNight(!isNight) }}>
            {children}
        </TimeContext.Provider>
    );
}
