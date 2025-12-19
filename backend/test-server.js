const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// AI generation endpoint (simplified)
app.post("/api/ai/generate", (req, res) => {
    console.log("Generate request received:", req.body);
    
    const { topic } = req.body;
    
    if (!topic || !topic.trim()) {
        console.log("Error: No topic provided");
        return res.status(400).json({ error: "Topic is required" });
    }
    
    // Simple test response
    res.json({ content: `Test post about: ${topic}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});