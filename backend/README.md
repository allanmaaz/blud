# Blud Backend

Spring Boot backend for Blud campus social app with WebSocket support.

## Technology Stack

- **Spring Boot 3.2.1**
- **Java 17**
- **Spring Security** with BCrypt password encoding
- **Spring WebSocket** with STOMP protocol
- **H2 Database** (in-memory)
- **Lombok** for code generation
- **Maven** for dependency management

## Running the Backend

### Development Mode
```bash
./mvnw spring-boot:run
```

### Build and Run JAR
```bash
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securepassword",
  "name": "Student Name"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securepassword"
}
```

#### Update Profile
```http
POST /api/auth/update-profile
Content-Type: application/json

{
  "email": "student@university.edu",
  "name": "Updated Name",
  "handle": "username",
  "major": "Computer Science",
  "dorm": "North Hall"
}
```

### WebSocket Connection

Connect to: `ws://localhost:8080/ws` (with SockJS fallback)

#### Subscribe to Topics
- `/topic/feed` - Real-time post updates
- `/topic/heatmap` - Campus activity heatmap updates

## Configuration

Edit `src/main/resources/application.properties`:

```properties
server.port=8080
logging.level.root=INFO
logging.level.com.blud=DEBUG
logging.level.org.springframework.web.socket=INFO
```

## Database

Uses H2 in-memory database. Data is reset on restart. Access H2 console at:
`http://localhost:8080/h2-console` (if enabled)

## Scheduled Tasks

- **Heatmap Updates**: Every 2 seconds
- **Post Generation**: Every 15 seconds

## Security Notes

⚠️ This is a prototype implementation:
- CORS is open to all origins
- No JWT tokens (using simple email-based auth)
- Passwords are properly hashed with BCrypt
- CSRF is disabled for prototype speed

For production, implement:
- JWT-based authentication
- Proper CORS configuration
- Rate limiting
- Input validation
- HTTPS only
