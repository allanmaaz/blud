package com.blud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class QuizEngine {

        @Autowired
        private SimpMessagingTemplate template;

        @Autowired
        private com.blud.service.OpenAIService openAIService;

        private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

        @Scheduled(fixedRate = 10000)
        public void generateQuiz() {
                // "AI" Generation
                String prompt = "Generate a challenging multiple-choice question about Computer Science, History, Philosophy, or Logic. "
                                +
                                "Return strictly valid JSON with no markdown formatting. " +
                                "Format: {\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": 0} "
                                +
                                "where correctAnswer is the 0-based index of the correct option.";

                String jsonResponse = openAIService.generateContent(prompt);

                try {
                        // Sanitize response if it contains markdown code blocks
                        if (jsonResponse.contains("```json")) {
                                jsonResponse = jsonResponse.replace("```json", "").replace("```", "").trim();
                        } else if (jsonResponse.contains("```")) {
                                jsonResponse = jsonResponse.replace("```", "").trim();
                        }

                        QuizTemplate quizData = objectMapper.readValue(jsonResponse, QuizTemplate.class);

                        Post quizPost = new Post(
                                        System.currentTimeMillis(),
                                        "Neural Feed",
                                        "Pop Quiz",
                                        quizData.question,
                                        "quiz",
                                        null,
                                        null,
                                        false,
                                        quizData.options,
                                        quizData.correctAnswer);

                        template.convertAndSend("/topic/feed", quizPost);

                } catch (Exception e) {
                        System.err.println("Failed to parse AI Quiz: " + e.getMessage());
                        // Fallback: Send a predefined quiz so the user sees SOMETHING
                        Post fallbackPost = new Post(
                                        System.currentTimeMillis(),
                                        "Neural Feed",
                                        "Pop Quiz (Offline Mode)",
                                        "The AI is currently resting (Quota Exceeded). What is the default port for Spring Boot?",
                                        "quiz",
                                        null,
                                        null,
                                        false,
                                        Arrays.asList("8000", "8080", "3000", "5432"),
                                        1);
                        template.convertAndSend("/topic/feed", fallbackPost);
                }
        }

        private static class QuizTemplate {
                public String question;
                public List<String> options;
                public int correctAnswer;
        }
}
