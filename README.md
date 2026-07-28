# Chatbot Application (Spring Boot + Gemini API)

A fully functional AI-powered chatbot backend built using Java, Spring Boot, and the Google Gemini API. This project processes user messages, sends them to Gemini, receives AI-generated responses, and stores the full conversation history in a database.

---

## Features

- AI chatbot using the Google Gemini API
- Clean REST API architecture
- Stores user message and bot reply in MySQL
- Follows proper Controller -> Service -> Repository pattern
- CORS enabled (frontend friendly)
- Basic HTML/CSS/JS frontend included in `chatbot-frontend/`
- Lightweight, beginner-friendly codebase

---

## Technologies Used

### Backend Stack
- Java 17
- Spring Boot (Web, JPA)
- Spring Data JPA
- MySQL
- Maven
- RestTemplate (for Gemini API calls)

### Libraries
- Lombok
- org.json

### Frontend
- HTML, CSS, JavaScript (no framework, static files)

---

## Project Structure

```
AI-chatBot/
├── chatbot-frontend/          # Static HTML/CSS/JS frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
├── src/main/java/com/chatbot/chatbot/
│   ├── ChatbotApplication.java
│   ├── controller/ChatController.java
│   ├── model/ChatMessage.java
│   ├── repo/ChatMessageRepo.java
│   └── service/ChatService.java
├── src/main/resources/
│   └── application.properties   # not committed, see setup below
├── pom.xml
└── README.md
```

---

## Requirements

Before you begin, install the following:

1. Java 17 or newer (JDK)
2. Maven (usually bundled with your IDE, or install separately)
3. MySQL Server 8.0 or newer
4. An IDE such as IntelliJ IDEA (Community or Ultimate)
5. A Google Gemini API key (see below)

---

## Setup Guide

### Step 1: Clone the repository

```
git clone https://github.com/Amankumar0152/AI-chatBot.git
```

### Step 2: Create the MySQL database

Log in to MySQL:

```
mysql -u root -p
```

Then run:

```sql
CREATE DATABASE chatbot;
```

Exit MySQL:

```sql
exit;
```

### Step 3: Get a Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account
3. Click "Create API key"
4. Copy the key
5. If this is your first key on this project, link a billing account at https://console.cloud.google.com/billing if you hit quota errors, since Google requires account verification for consistent free-tier access on current models

### Step 4: Configure application.properties

This file is intentionally excluded from the repository (see `.gitignore`) so that credentials are never committed. Create it yourself at:

```
src/main/resources/application.properties
```

With the following content:

```
spring.datasource.url=jdbc:mysql://localhost:3306/chatbot
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

gemini.api.key=${GEMINI_API_KEY}
```

### Step 5: Set environment variables

Rather than hardcoding secrets in the file above, provide them as environment variables.

In IntelliJ:

1. Open Run menu, then Edit Configurations
2. Select or create the Spring Boot run configuration for ChatbotApplication
3. Open Modify Options, enable Environment Variables
4. In the Environment Variables field, enter:

```
DB_PASSWORD=your_mysql_root_password;GEMINI_API_KEY=your_gemini_api_key
```

Replace both values with your own.

### Step 6: Run the application

Click Run in IntelliJ, or from the command line:

```
mvnw.cmd spring-boot:run
```

The server starts on port 8080. A successful start shows a line like:

```
Started ChatbotApplication in X seconds
```

### Step 7: Test the API

The chat endpoint accepts a raw plain-text request body (not JSON).

Using curl:

```
curl -X POST http://localhost:8080/api/chat -H "Content-Type: text/plain" -d "Hello, who are you?"
```

Or using Postman:

1. Method: POST
2. URL: http://localhost:8080/api/chat
3. Body: raw, type Text
4. Enter your message and send

### Step 8: Try the frontend

Open `chatbot-frontend/index.html` directly in your browser while the backend is running on port 8080.

---

## Notes

- Never commit `application.properties` with real credentials. It is listed in `.gitignore` for this reason.
- Gemini model names change frequently as Google deprecates older versions. If you get a 404 model-not-found error, check https://ai.google.dev/gemini-api/docs/models for the current model list and update the model name in `ChatService.java`.
- If you see a 429 quota error mentioning `free_tier_requests, limit: 0`, this usually means the model you are calling is no longer covered under free tier, not a problem with your key. Switch to a currently supported model.

---

## License

See the LICENSE file in this repository.
