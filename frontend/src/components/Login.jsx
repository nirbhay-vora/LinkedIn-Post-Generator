import { useState } from "react";
import API from "../api";

export default function Login({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const res = await API.post("/auth/login", credentials);
            localStorage.setItem("token", res.data.token);
            onLogin(res.data.token);
        } catch (error) {
            alert("Invalid credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <div className="header">
                    <h1 className="title">🔐 Admin Login</h1>
                    <p className="subtitle">Enter your credentials to access the LinkedIn Post Generator</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input
                            className="topic-input"
                            type="text"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            required
                        />
                        <input
                            className="topic-input"
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required
                        />
                        <button 
                            type="submit" 
                            className={`btn btn-primary btn-full-width ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner"></span> Logging in...</>
                            ) : (
                                <>🚀 Login</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}