package com.blud;

// Fixed package declaration triggers

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Optional;
import java.util.Random;

@SpringBootApplication
@EnableScheduling
public class BludApplication {

    public static void main(String[] args) {
        SpringApplication.run(BludApplication.class, args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// --- Security Configuration ---

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/ws/**", "/error").permitAll() // Public Endpoints
                        .anyRequest().authenticated());
        return http.build();
    }
}

// --- Database User Entity ---

@Entity
@Table(name = "users")
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;

    // Profile Data
    private String name;
    private String handle;
    private String major;
    private String dorm;
    private String avatar;

    // Constructors
    public User() {
    }

    public User(Long id, String email, String password, String name, String handle, String major, String dorm,
            String avatar) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.handle = handle;
        this.major = major;
        this.dorm = dorm;
        this.avatar = avatar;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getDorm() {
        return dorm;
    }

    public void setDorm(String dorm) {
        this.dorm = dorm;
    }

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(length = 1000000)
    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    private String birthDate;
    private String productivity;
    private String successRate;

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getProductivity() {
        return productivity;
    }

    public void setProductivity(String productivity) {
        this.productivity = productivity;
    }

    public String getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(String successRate) {
        this.successRate = successRate;
    }

    // Builder pattern (manual implementation)
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String name;
        private String handle;
        private String major;
        private String dorm;
        private String avatar;

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder handle(String handle) {
            this.handle = handle;
            return this;
        }

        public UserBuilder major(String major) {
            this.major = major;
            return this;
        }

        public UserBuilder dorm(String dorm) {
            this.dorm = dorm;
            return this;
        }

        public UserBuilder avatar(String avatar) {
            this.avatar = avatar;
            return this;
        }

        public User build() {
            return new User(id, email, password, name, handle, major, dorm, avatar);
        }
    }
}

interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// --- Auth Controller ---

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow frontend access
class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName()) // Can be empty initially
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedData) {
        // In a real app, get ID from SecurityContext/JWT. using email for prototype
        // simple auth
        Optional<User> userOpt = userRepository.findByEmail(updatedData.getEmail());
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            // Self-healing: Create user if missing (DB reset scenario)
            user = new User();
            user.setEmail(updatedData.getEmail());
            user.setPassword(passwordEncoder.encode("password")); // Default password for recovered users
        }

        user.setName(updatedData.getName());
        user.setHandle(updatedData.getHandle());
        user.setMajor(updatedData.getMajor());
        user.setDorm(updatedData.getDorm());
        user.setAvatar(updatedData.getAvatar()); // Persist Avatar
        user.setBirthDate(updatedData.getBirthDate());
        user.setProductivity(updatedData.getProductivity());
        user.setSuccessRate(updatedData.getSuccessRate());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}

// DTOs
class SignupRequest {
    private String email;
    private String password;
    private String name;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

// --- WebSocket Configuration ---

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}

// --- Schedulers (Traffic Engine) ---

@Controller
class TrafficEngine {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private com.blud.service.OpenAIService openAIService;

    private final Random random = new Random();

    @Scheduled(fixedRate = 2000)
    public void pulseHeatmap() {
        int zoneId = random.nextInt(64);
        double activity = 0.5 + (random.nextDouble() * 0.5);
        HeatmapUpdate update = new HeatmapUpdate(zoneId, activity);
        template.convertAndSend("/topic/heatmap", update);
    }

    @Scheduled(fixedRate = 5000)
    public void generatePost() {
        boolean isAnonymous = random.nextDouble() < 0.5;
        String postContent;
        String author;

        if (isAnonymous) {
            author = "The Void";
            String prompt = "Write a 1-sentence cryptic, surreal, glitchy university confession or observation from 'The Void'. "
                    +
                    "Max 100 chars. No quotes. Examples: 'The architecture building is breathing.', 'I found a door that wasn't here yesterday.'";
            postContent = openAIService.generateContent(prompt).replace("\"", "");
        } else {
            String[] authors = { "Design Studio", "Late Night Crew", "Philosophy Club", "Music Dept", "North Hall" };
            String[] contents = {
                    "Who left the lights on in studio 4?",
                    "Jazz session starting in 5 mins.",
                    "Found a blue scarf near the fountain.",
                    "Anyone up for a coffee run?",
                    "The moon looks insane right now.",
                    "I heard the falafel place is closing early.",
                    "Can someone explain the reading for tomorrow?",
                    "Lost my ID again. DM me if found.",
                    "Studio smells like spray paint and regret.",
                    "Is the library open 24h yet?"
            };
            author = authors[random.nextInt(authors.length)];
            postContent = contents[random.nextInt(contents.length)];
        }

        Post post = new Post(System.currentTimeMillis(), author, "Just now", postContent, "text", null, null,
                isAnonymous, null, null);
        template.convertAndSend("/topic/feed", post);
    }
}

class HeatmapUpdate {
    private int id;
    private double activity;

    public HeatmapUpdate() {
    }

    public HeatmapUpdate(int id, double activity) {
        this.id = id;
        this.activity = activity;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getActivity() {
        return activity;
    }

    public void setActivity(double activity) {
        this.activity = activity;
    }
}

class Post {
    private long id;
    private String author;
    private String time;
    private String content;
    private String type;
    private String image;
    private String duration;
    private boolean isAnonymous;
    private java.util.List<String> options;
    private Integer correctAnswer;

    public Post() {
    }

    public Post(long id, String author, String time, String content, String type, String image, String duration,
            boolean isAnonymous, java.util.List<String> options, Integer correctAnswer) {
        this.id = id;
        this.author = author;
        this.time = time;
        this.content = content;
        this.type = type;
        this.image = image;
        this.duration = duration;
        this.isAnonymous = isAnonymous;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    // ... existing getters setters ...

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public java.util.List<String> getOptions() {
        return options;
    }

    public void setOptions(java.util.List<String> options) {
        this.options = options;
    }

    public Integer getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(Integer correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}

// --- Stats Controller ---

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
class StatsController {

    private final UserRepository userRepository;

    public StatsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/dorms")
    public java.util.List<DormStat> getDormStats() {
        java.util.List<User> users = userRepository.findAll();

        // Group by dorm and calculate average productivity + success rate for a "Meta
        // Score"
        // For now kept simple
        java.util.Map<String, Double> dormAvg = users.stream()
                .filter(u -> u.getDorm() != null && !u.getDorm().isEmpty())
                .filter(u -> u.getProductivity() != null && u.getProductivity().matches("\\d+"))
                .collect(java.util.stream.Collectors.groupingBy(
                        User::getDorm,
                        java.util.stream.Collectors.averagingInt(u -> Integer.parseInt(u.getProductivity()))));

        return dormAvg.entrySet().stream()
                .map(e -> new DormStat(e.getKey(), Math.round(e.getValue())))
                .sorted((a, b) -> Long.compare(b.getScore(), a.getScore())) // Descending
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping("/score")
    public ResponseEntity<?> updateScore(@RequestBody ScoreUpdate request) {
        // In a real app, use SecurityContext for user ID
        java.util.Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Gamification Logic:
            // 1. Boost Productivity (0-100)
            int currentProd = 0;
            try {
                currentProd = Integer.parseInt(user.getProductivity());
            } catch (Exception e) {
            }
            int newProd = Math.min(100, currentProd + 2); // +2 XP
            user.setProductivity(String.valueOf(newProd));

            // 2. Boost Success Rate
            int currentSuccess = 0;
            try {
                currentSuccess = Integer.parseInt(user.getSuccessRate());
            } catch (Exception e) {
            }
            int newSuccess = Math.min(100, currentSuccess + 1);
            user.setSuccessRate(String.valueOf(newSuccess));

            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}

class DormStat {
    private String name;
    private long score;

    public DormStat(String name, long score) {
        this.name = name;
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public long getScore() {
        return score;
    }
}

class ScoreUpdate {
    private String email;
    private boolean correct;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}

// --- Radio Engine ---

@Controller
class RadioEngine {

    @Autowired
    private SimpMessagingTemplate template;

    private final String[] playlist = {
            "Aphex Twin - #3",
            "Nujabes - Aruarian Dance",
            "Brian Eno - An Ending (Ascent)",
            "Burial - Archangel",
            "Tycho - Awake"
    };

    private int currentTrackIndex = 0;
    private long trackStartTime = System.currentTimeMillis();
    private final long TRACK_DURATION = 180000; // 3 minutes per track for demo

    @Scheduled(fixedRate = 1000)
    public void broadcastRadioState() {
        long now = System.currentTimeMillis();
        long elapsed = now - trackStartTime;

        if (elapsed > TRACK_DURATION) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            trackStartTime = now;
            elapsed = 0;
        }

        RadioUpdate update = new RadioUpdate(
                playlist[currentTrackIndex],
                elapsed,
                TRACK_DURATION,
                "LIVE");
        template.convertAndSend("/topic/radio", update);
    }
}

class RadioUpdate {
    private String track;
    private long elapsed;
    private long total;
    private String status;

    public RadioUpdate(String track, long elapsed, long total, String status) {
        this.track = track;
        this.elapsed = elapsed;
        this.total = total;
        this.status = status;
    }

    public String getTrack() {
        return track;
    }

    public long getElapsed() {
        return elapsed;
    }

    public long getTotal() {
        return total;
    }

    public String getStatus() {
        return status;
    }
}
