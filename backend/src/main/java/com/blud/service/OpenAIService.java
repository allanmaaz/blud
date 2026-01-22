package com.blud.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@Service
public class OpenAIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private String apiKey = System.getenv("OPENAI_API_KEY");

    public void setApiKey(String key) {
        this.apiKey = key;
    }

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "Simulated AI: Key not set. " + prompt;
        }

        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);

        body.put("messages", messages);
        body.put("temperature", 0.9);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, String> msg = (Map<String, String>) firstChoice.get("message");
                    return msg.get("content").trim();
                }
            }
        } catch (Exception e) {
            System.err.println("OpenAI API Failed: " + e.getMessage());
            return "Simulated Fallback: " + prompt;
        }

        return "Fallback content.";
    }
}
