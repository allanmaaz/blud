"use client";

import { Card } from "@/components/ui/Card";
import CampusVibeCheck from "@/components/features/CampusVibeCheck";
import AudioPlayer from "@/components/ui/AudioPlayer";
import ZineRow from "@/components/features/ZineRow";
import QuizInteraction from "@/components/features/QuizInteraction";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import webSocketService from "@/lib/websocket-service";

interface Post {
  id: number;
  author: string;
  time: string;
  content: string;
  type: string;
  image?: string;
  duration?: string;
  isAnonymous?: boolean;
  options?: string[];
  correctAnswer?: number; // 0-indexed index of correct option
}

export default function Home() {
  const posts = [
    {
      id: 5,
      author: "Music Dept",
      time: "2m ago",
      content: "Jazz ensemble warming up in the quad. It's raining lightly.",
      type: "audio",
      duration: "0:24",
      isAnonymous: false
    },
    {
      id: 6,
      author: "The Void",
      time: "5m ago",
      content: "I think the architecture building is breathing.",
      type: "text",
      isAnonymous: true
    },
    {
      id: 7,
      author: "Design Studio",
      time: "12m ago",
      content: "Who took the exacto knives? Bring them back.",
      type: "text",
      isAnonymous: false
    },
    {
      id: 8,
      author: "The Void",
      time: "20m ago",
      content: "Does anyone else hear the humming?",
      type: "text",
      isAnonymous: true
    },
    {
      id: 9,
      author: "North Hall",
      time: "1h ago",
      content: "Free pizza in the common room. Gone in 5 mins.",
      type: "text",
      isAnonymous: false
    }
  ];

  const router = useRouter();
  const [livePosts, setLivePosts] = useState<Post[]>(posts);
  const [activeTab, setActiveTab] = useState<"public" | "void">("public");

  // Auth Protection
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const subscription = webSocketService.subscribe('/topic/feed', (newPost: unknown) => {
      const post = newPost as Post;
      setLivePosts(prev => {
        const updated = [{ ...post, id: Date.now() + Math.random() }, ...prev];
        return updated.slice(0, 50); // Limit to 50 items to prevent "stacking"/lag
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const displayedPosts = livePosts.filter(p =>
    activeTab === "public" ? !p.isAnonymous : p.isAnonymous
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 pt-12 pb-32">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif text-blud-blue tracking-tight mb-1 bg-gradient-to-r from-blud-blue to-blud-blue/70 bg-clip-text text-transparent">Common Room</h1>
          <p className="text-sm text-blud-blue/60">Your campus, right now</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-blud-blue/50 uppercase tracking-wider block">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
          <span className="text-2xl font-bold text-blud-blue/80 block mt-1">
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="flex border-b border-blud-blue/10 mb-6">
        <button
          onClick={() => setActiveTab("public")}
          className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${activeTab === "public" ? "text-blud-blue border-b-2 border-blud-blue" : "text-blud-blue/40 hover:text-blud-blue/60"}`}
        >
          PUBLIC FEED
        </button>
        <button
          onClick={() => setActiveTab("void")}
          className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${activeTab === "void" ? "text-red-500 border-b-2 border-red-500" : "text-blud-blue/40 hover:text-red-500/60"}`}
        >
          THE VOID
        </button>
      </div>

      <div className="mb-4">
        <CampusVibeCheck />
      </div>

      <div className="mb-8">
        <ZineRow />
      </div>

      <div className="space-y-6 pb-24">
        {/* Feed */}
        <section className="space-y-4">
          {displayedPosts.length === 0 && (
            <div className="text-center py-10 text-blud-blue/30 italic font-serif">
              {activeTab === "public" ? "Waiting for signals..." : "The void is silent... for now."}
            </div>
          )}
          {displayedPosts.map((post) => (
            <Card key={post.id} className={`space-y-3 ${post.isAnonymous ? "border-red-500/20 bg-red-900/5" : ""}`}>
              <div className="flex justify-between items-baseline">
                {post.isAnonymous ? (
                  <span className="font-mono text-lg text-red-500 font-bold tracking-widest uppercase">UNKNOWN</span>
                ) : (
                  <span className="font-serif text-lg text-blud-blue">{post.author}</span>
                )}
                <span className="text-xs font-sans text-blud-blue/40">{post.time}</span>
              </div>

              {post.type === 'image' && post.image && (
                <div className="rounded-lg overflow-hidden border border-blud-blue/10 aspect-video bg-blud-blue/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt="Post content" className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" />
                </div>
              )}

              {post.type === 'audio' && (
                <div className="mt-3">
                  <AudioPlayer duration={post.duration} />
                </div>
              )}

              {post.type === 'quiz' && post.options && (
                <QuizInteraction post={post} />
              )}

              <p className={`font-sans leading-relaxed text-base ${post.isAnonymous ? "text-red-900/80 italic font-medium" : "text-blud-blue/85"}`}>
                {post.content}
              </p>
            </Card>
          ))}
        </section>

        <div className="h-12 flex items-center justify-center text-blud-blue/20 text-sm font-serif italic">
          End of transmission.
        </div>
      </div>
    </div>
  );
}
