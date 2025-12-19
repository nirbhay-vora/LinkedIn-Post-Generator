const axios = require("axios");
const { auth } = require("../../middleware/auth");

exports.loginLinkedIn = async (req, res) => {
    const redirectUrl =
        "https://www.linkedin.com/oauth/v2/authorization?" +
        `response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}` +
        "&scope=openid%20profile%20email%20w_member_social";

    res.redirect(redirectUrl);
};

exports.linkedinCallback = async (req, res) => {
    try {
        const code = req.query.code;
        const error = req.query.error;
        
        if (error) {
            return res.redirect(`http://localhost:5173?error=${error}`);
        }
        
        if (!code) {
            return res.redirect(`http://localhost:5173?error=no_code`);
        }

        const tokenResponse = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        res.redirect(`http://localhost:5173?accessToken=${accessToken}`);
    } catch (error) {
        console.error("OAuth Error:", error.response?.data);
        res.redirect(`http://localhost:5173?error=oauth_failed`);
    }
};

exports.postToLinkedIn = async (req, res) => {
    try {
        const { accessToken, content } = req.body;
        
        if (!accessToken || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Get user profile first
        const profileResponse = await axios.get(
            "https://api.linkedin.com/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const userId = profileResponse.data.sub;

        // Create post using stable v2 API
        const postResponse = await axios.post(
            "https://api.linkedin.com/v2/ugcPosts",
            {
                author: `urn:li:person:${userId}`,
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: content
                        },
                        shareMediaCategory: "NONE"
                    }
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0"
                }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error("Post Error:", error.response?.data);
        res.status(500).json({ error: "Failed to post" });
    }
};
