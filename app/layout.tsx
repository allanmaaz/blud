import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/ui/GrainOverlay";
import BottomNav from "@/components/ui/BottomNav";

import SidebarNav from "@/components/ui/SidebarNav";
import Widgets from "@/components/ui/Widgets";  // Restore Widgets import

import TimeProvider from "@/components/providers/TimeProvider";
import { SoundProvider } from "@/components/providers/SoundProvider";
import RadioTicker from "@/components/features/RadioTicker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blud - Campus Common Room",
  description: "University-only social app. No reels, no likes, just campus life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased pb-24 md:pb-0 transition-colors duration-500 scrollbar-hide`}
      >
        <TimeProvider>
          <SoundProvider>
            <GrainOverlay />

            <div className="min-h-screen md:grid md:grid-cols-[280px_1fr_320px] md:max-w-7xl md:mx-auto">
              {/* Desktop Sidebar */}
              <aside className="hidden md:block h-screen sticky top-0 border-r border-blud-blue/10 overflow-y-auto scrollbar-hide">
                <SidebarNav />
              </aside>

              {/* Main Content Area */}
              <main className="relative z-10 w-full max-w-md mx-auto md:max-w-xl border-x-0 md:border-r border-blud-blue/10 min-h-screen">
                {children}
              </main>

              {/* Desktop Widgets */}
              <aside className="hidden md:block h-screen sticky top-0 overflow-y-auto scrollbar-hide">
                <Widgets />
              </aside>
            </div>

            {/* <RadioTicker /> */}

            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
              <BottomNav />
            </div>
          </SoundProvider>
        </TimeProvider>
      </body>
    </html>
  );
}
