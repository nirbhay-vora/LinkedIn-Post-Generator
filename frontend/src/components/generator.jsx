import { useState, useEffect } from "react";
import API from "../api";

export default function Generator() {
    const [topic, setTopic] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    // Check for access token or errors in URL when component loads
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('accessToken');
        const error = urlParams.get('error');
        const description = urlParams.get('description');
        
        if (token) {
            setAccessToken(token);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            alert(`LinkedIn connection failed: ${error} - ${description || 'Unknown error'}`);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const generate = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic first!");
            return;
        }
        
        if (loading) return; // Prevent multiple clicks
        
        setLoading(true);
        try {
            console.log("Making request to:", API.defaults.baseURL + "/ai/generate");
            console.log("With topic:", topic);
            
            const res = await API.post("/ai/generate", { topic });
            console.log("Response received:", res.data);
            setContent(res.data.content);
            setTopic(""); // Clear input after generation
        } catch (error) {
            console.error("Generation failed - Full error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            const errorMsg = error.response?.data?.error || "Failed to generate content. Please try again.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const getLinkedInAccess = () => {
        window.location.href = `${API.defaults.baseURL}/linkedin/login`;
    };

    const postToLinkedIn = async () => {
        if (posting) return; // Prevent multiple clicks
        
        setPosting(true);
        try {
            await API.post("/linkedin/post", {
                accessToken,
                content
            });
            alert("Posted to LinkedIn!");
            
            // Reset content and topic but keep LinkedIn connection
            setContent("");
            setTopic("");
        } catch (error) {
            console.error("LinkedIn post error:", error.response?.data);
            alert("Failed to post: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <div className="header">
                    <h1 className="title">🚀 AI LinkedIn Post Generator</h1>
                    <p className="subtitle">Create engaging LinkedIn posts with AI</p>
                </div>

                <div className="input-section">
                    <div className="input-group">
                        <input
                            className="topic-input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What would you like to post about?"
                        />
                        <button className={`btn btn-primary ${loading ? 'loading' : ''}`} onClick={generate} disabled={loading}>
                            {loading ? (
                                <><span className="spinner"></span> Generating...</>
                            ) : (
                                <>✨ Generate Post</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="linkedin-section">
                    {!accessToken ? (
                        <button className="btn btn-linkedin btn-full-width" onClick={getLinkedInAccess}>
                            <span className="linkedin-icon">💼</span>
                            Connect LinkedIn
                        </button>
                    ) : (
                        <div className="connection-status">
                            <span className="status-icon">✅</span>
                            <span className="status-text">LinkedIn Connected</span>
                        </div>
                    )}
                </div>

                {content && (
                    <div className="content-section">
                        <div className="content-header">
                            <h3>📝 Your Generated Post</h3>
                            <span className="content-length">{content.length} characters</span>
                        </div>
                        

                        <textarea
                            className="content-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            placeholder="Your AI-generated content will appear here..."
                        />

                        {accessToken && (
                            <button 
                                className={`btn btn-success btn-full-width ${posting ? 'loading' : ''}`} 
                                onClick={postToLinkedIn} 
                                disabled={posting}
                            >
                                {posting ? (
                                    <><span className="spinner"></span> Posting...</>
                                ) : (
                                    <>🚀 Post to LinkedIn</>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
