# Blud - Campus Common Room

A university-only social app focused on authentic campus life. No reels, no likes, just real-time connections.

## Features

- 🏫 **Common Room** - Real-time campus feed with posts, images, and audio
- ✨ **Campus Vibe Check** - AI-generated mood descriptions based on real-time context
- 📰 **Classifieds** - Newspaper-style bulletin board for lost & found, sales, etc.
- 🔄 **Weekly Rituals** - Low-effort prompts to keep the community connected
- 🗺️ **Campus Heatmap** - Live visualization of campus activity
- 📻 **Radio Ticker** - Shared music playlist with live updates
- 🎨 **Fresh Zines** - Student-created digital zines
- 🪪 **Student ID Card** - Digital profile with editable information
- 🌙 **Night Mode** - Automatic or manual dark theme switching

## Project Structure

```
blud/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── classifieds/       # Classifieds page
│   ├── login/             # Authentication
│   ├── onboarding/        # User setup flow
│   ├── profile/           # User profile
│   └── rituals/           # Weekly rituals
├── components/
│   ├── features/          # Feature-specific components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and services
├── backend/               # Spring Boot backend
│   └── src/main/java/com/blud/
│       └── BludApplication.java  # All-in-one backend
└── public/                # Static assets
```


