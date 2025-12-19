const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const { auth } = require("./middleware/auth");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Auth routes
app.use("/api/auth", require("./src/routes/authRoutes"));

// LinkedIn routes (OAuth handles its own auth)
app.use("/api/linkedin", require("./src/routes/linkedinRoutes"));

// Serve static files from frontend build (after API routes)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Direct AI endpoint using Groq (protected)
app.post("/api/ai/generate", auth, async (req, res) => {
  console.log("Request received:", req.body);
  console.log("API Key present:", !!process.env.GROQ_API_KEY);

  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API key missing" });
    }

    console.log("Making Groq request for content...");

    // Generate LinkedIn post content
    const contentResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [
          {
            role: "user",
            content: `Create an engaging LinkedIn post about: ${topic}.

Requirements:
- Use bullet points to make it scannable and interesting
- Start with a compelling hook or question
- Include 3-5 key bullet points with insights or tips
- Add relevant emojis to make it visually appealing
- End with a call-to-action question to encourage engagement
- Keep it under 150 words
- Write ONLY the post content, no introductory text
- Make it unique and valuable for LinkedIn professionals
- Use CAPITAL LETTERS for emphasis on important terms
- Use bullet points with • symbol
- NEVER use asterisks ** for formatting
- NO markdown formatting - use plain text only
- Use emojis and spacing for visual appeal
- Do not wrap text in ** or any other symbols
- Write in a natural, human tone as if manually researched and written
- Avoid AI-sounding phrases like "Here are the top...", "Let's dive into...", "In conclusion..."
- Use personal insights and conversational language
- Sound like a professional sharing genuine expertise and experience
- Include specific details that show real knowledge of the topic`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Content generation completed");

    let aiText = contentResponse.data.choices[0].message.content;
    
    // Remove markdown asterisks
    aiText = aiText.replace(/\*\*(.*?)\*\*/g, '$1');
    
    res.json({ content: aiText });
  } catch (error) {
    console.error("Full error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
