package com.chatbot.chatbot.controller;

import com.chatbot.chatbot.dto.ChatRequest;
import com.chatbot.chatbot.dto.ChatResponse;
import com.chatbot.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String reply = chatService.getBotReply(request.getMessage());
        return new ChatResponse(reply);
    }
}