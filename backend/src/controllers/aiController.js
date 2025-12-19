const axios = require("axios");

exports.generatePost = async (req, res) => {
  console.log("Generate request received:", req.body);

  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      console.log("Error: No topic provided");
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      console.log("Error: No API key configured");
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    console.log("Making request to Gemini API...");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GROQ_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Write a LinkedIn-style professional post about: ${topic}. Keep it engaging, conversational and under 150 words.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("Gemini API response received");

    if (!response.data.candidates || !response.data.candidates[0]) {
      console.log("Error: No candidates in response");
      return res.status(500).json({ error: "No content generated" });
    }

    const aiText = response.data.candidates[0].content.parts[0].text;
    console.log("Success: Content generated");
    res.json({ content: aiText });
  } catch (error) {
    console.error("AI Generation Error Details:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    if (error.response?.status === 400) {
      res.status(400).json({ error: "Invalid API request" });
    } else if (error.response?.status === 403) {
      res.status(403).json({ error: "API key invalid or quota exceeded" });
    } else {
      res.status(500).json({ error: "AI generation failed" });
    }
  }
};
