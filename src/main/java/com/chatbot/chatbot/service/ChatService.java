package com.chatbot.chatbot.service;

import com.chatbot.chatbot.model.ChatMessage;
import com.chatbot.chatbot.repo.ChatMessageRepo;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepo repo;

    @Value("${gemini.api.key}")
    private String apiKey;

    public String getBotReply(String userMessage) {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + apiKey;


//        JSON blocks
        JSONObject request = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", userMessage)
                                        )
                                )
                        )
                );


        RestTemplate rest = new RestTemplate();
        String response = rest.postForObject(url, request.toString(), String.class);

        JSONObject json = new JSONObject(response);

        String reply = json
                .getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text");

        // Save in DB
        ChatMessage chat = new ChatMessage();
        chat.setUserMessage(userMessage);
        chat.setBotResponse(reply);
        repo.save(chat);

        return reply;
    }
}
