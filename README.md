# LinkedIn Post Generator

AI-powered LinkedIn post generator with authentication and direct posting capabilities.

## Features

- 🤖 AI-powered content generation using Groq API
- 🔐 JWT-based authentication
- 📱 Responsive design with glassmorphism effects
- 🔗 Direct LinkedIn posting via OAuth
- 🚀 Modern MERN stack architecture

## Tech Stack

- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express.js
- **AI**: Groq API (Llama 3.1)
- **Authentication**: JWT, LinkedIn OAuth
- **Styling**: Modern CSS with gradients and glassmorphism

## Environment Variables

Create a `.env` file in the backend directory:

```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=your_redirect_uri
```

## Local Development

1. Install dependencies:
```bash
npm run install-backend
npm run install-frontend
```

2. Start the development server:
```bash
npm run dev
```

## Deployment

This app is configured for deployment on Render.com with automatic builds.

## License

MIT