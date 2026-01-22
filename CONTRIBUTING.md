# Contributing to Blud

Thank you for your interest in contributing to Blud!

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/blud.git
   cd blud
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key if testing vibe generation
   ```

4. **Run the Development Servers**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

## Code Style

- **Frontend**: Follow the existing TypeScript/React patterns
- **Backend**: Follow Java/Spring Boot conventions
- **Commits**: Use clear, descriptive commit messages

### TypeScript Guidelines
- Use TypeScript types, avoid `any`
- Use functional components with hooks
- Keep components focused and single-purpose
- Use Tailwind CSS for styling

### Java Guidelines
- Use Lombok annotations to reduce boilerplate
- Follow Spring Boot best practices
- Keep controllers RESTful
- Document complex logic

## Testing

### Frontend
```bash
npm run lint        # Run ESLint
npm run build       # Test production build
```

### Backend
```bash
cd backend
./mvnw test         # Run tests
./mvnw clean verify # Full verification
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Test your changes thoroughly
4. Commit with clear messages
5. Push to your fork
6. Open a Pull Request

## Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌐 Internationalization
- ⚡ Performance optimizations
- 🧪 Test coverage

## Questions?

Feel free to open an issue for any questions or clarifications!
