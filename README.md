# Blud - Campus Common Room

A university-only social app focused on authentic campus life. No reels, no likes, just real-time connections.

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **WebSocket** (SockJS + STOMP) for real-time updates
- **OpenAI API** for AI-generated campus vibes

### Backend
- **Spring Boot 3.2.1** with Java 17
- **WebSocket** support with STOMP
- **Spring Security** with BCrypt
- **H2 Database** (in-memory for development)
- **Lombok** for boilerplate reduction

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- (Optional) OpenAI API key for vibe generation

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blud
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key (optional)
   ```

### Running the Application

#### Start the Backend (Terminal 1)
```bash
cd backend
./mvnw spring-boot:run
```
Backend will run on `http://localhost:8080`

#### Start the Frontend (Terminal 2)
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

### Building for Production

#### Frontend
```bash
npm run build
npm run start
```

#### Backend
```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

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

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/update-profile` - Update user profile

### WebSocket Topics
- `/topic/feed` - Real-time post feed
- `/topic/heatmap` - Campus activity heatmap updates

## Development Notes

- The backend uses an in-memory H2 database (data resets on restart)
- WebSocket connection automatically reconnects on disconnect
- AI vibe generation falls back to mock data if no OpenAI key is provided
- All authentication is prototype-level (not production-ready)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Contributing

This is a prototype application. Feel free to explore and extend it!

## License

MIT
