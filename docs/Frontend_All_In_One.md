# Frontend Reference (Consolidated)

This document provides a single-view reference of the key frontend files for Blud.

## 1. Main Page (`app/page.tsx`) (Protected)
```typescript
"use client";

import { Card } from "@/components/ui/Card";
import CampusVibeCheck from "@/components/features/CampusVibeCheck";
import AudioPlayer from "@/components/ui/AudioPlayer";
import ZineRow from "@/components/features/ZineRow";
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
}

export default function Home() {
  const posts = [
    {
      id: 5,
      author: "Music Dept",
      time: "Just now",
      content: "Jazz ensemble warming up in the quad. It's raining lightly.",
      type: "audio",
      duration: "0:24",
    },
    // ...
  ];

  const router = useRouter();
  // Real-time Feed State
  const [livePosts, setLivePosts] = useState<Post[]>(posts);

  // Auth Protection
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    webSocketService.subscribe('/topic/feed', (newPost: unknown) => {
      const post = newPost as Post;
      setLivePosts(prev => [{ ...post, id: Date.now() }, ...prev]);
    });
    return () => { };
  }, []);
  
  // Render Logic...
  return (
    <div className="max-w-md mx-auto p-6 space-y-8 pt-12">
        {/* ... */}
    </div>
  );
}
```

## 2. Login Page (`app/login/page.tsx`)
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
    // Login/Signup Logic fetching from localhost:8080/api/auth
    // ...
    return ( 
        // Form UI
     );
}
```

## 3. Onboarding Page (`app/onboarding/page.tsx`)
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OnboardingPage() {
    // Profile Completion Logic (Handle, Major, Dorm)
    // ...
    return (
        // Multi-step Form UI
    );
}
```

## 4. Student ID (`components/features/StudentIdCard.tsx`)
```typescript
// ... (Previous content)
```

## 5. Campus Heatmap (`components/features/CampusHeatmap.tsx`)
```typescript
// ... (Previous content)
```

## 6. WebSocket Service (`lib/websocket-service.ts`)
```typescript
// ... (Previous content)
```
