# HR Buddy - AI-Powered Interview Quiz Platform

A complete MERN stack web application that enables HR professionals to create AI-generated interview quizzes, assign time limits, and send quizzes to candidates. Built with React, Node.js, Express, MongoDB, and ES Modules.

## Features

### For HR Users
- 🔐 Secure authentication with JWT
- ✨ AI-powered question generation based on job profiles
- 📝 Create and manage custom interview quizzes (15-20 questions)
- ⏱️ Set time limits (5-60 minutes)
- 📊 View candidate results and detailed analytics
- 🔗 Share quiz links with candidates
- 📈 Track quiz attempts and performance metrics

### For Candidates
- 🎯 Take quizzes via shared links (no login required)
- ⏰ Timed quiz experience with countdown timer
- 🔄 Auto-submit on timeout
- 📋 Instant results with detailed feedback
- ✅ See correct answers after completion

## Tech Stack

### Backend
- **Node.js** + **Express.js** (ES Modules)
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled
- **dotenv** for environment variables

### Frontend
- **React** (Functional components with Hooks)
- **React Router** for navigation
- **Axios** for API calls
- **Vite** for build tooling
- Clean minimal UI with inline styles

## Project Structure

```
HR-Buddy/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js           # HR user model
│   │   ├── Quiz.js           # Quiz model
│   │   └── Attempt.js        # Quiz attempt model
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── quizController.js     # Quiz CRUD operations
│   │   ├── aiController.js       # AI question generation
│   │   └── attemptController.js  # Quiz attempt handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── aiRoutes.js
│   │   └── attemptRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateQuiz.jsx
    │   │   ├── QuizAttempts.jsx
    │   │   ├── QuizWelcome.jsx
    │   │   ├── TakeQuiz.jsx
    │   │   └── QuizResults.jsx
    │   ├── services/
    │   │   └── api.js              # API service layer
    │   ├── context/
    │   │   └── AuthContext.jsx     # Authentication context
    │   ├── utils/
    │   │   └── formatTime.js       # Time formatting utilities
    │   ├── App.jsx                 # Main app with routing
    │   ├── main.jsx               # Entry point
    │   └── index.css              # Global styles
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr-buddy
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development

# Optional: AI Configuration (for OpenAI integration)
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## MongoDB Setup

### Local MongoDB
1. Install MongoDB on your machine
2. Start MongoDB service:
```bash
mongod
```
3. Use connection string: `mongodb://localhost:27017/hr-buddy`

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## AI Question Generation

The application includes a template-based question generator as a fallback. To integrate real AI:

### Option 1: OpenAI Integration

1. Get API key from [OpenAI](https://platform.openai.com/)
2. Add to backend `.env`:
```env
OPENAI_API_KEY=sk-your-key-here
AI_MODEL=gpt-3.5-turbo
```

3. Update `backend/controllers/aiController.js`:
   - Uncomment the OpenAI implementation code
   - Install OpenAI SDK: `npm install openai`
   - The commented code shows exactly how to integrate

### Option 2: Other AI Providers
The AI controller is designed to be provider-agnostic. You can integrate:
- Anthropic Claude
- Google PaLM
- Cohere
- Any other LLM API

Simply modify the `generateQuestionsForProfile` function in `backend/controllers/aiController.js`.

## API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new HR user
POST   /api/auth/login       # Login HR user
GET    /api/auth/me          # Get current user (protected)
```

### Quiz Management (HR Only)
```
POST   /api/quizzes                # Create quiz
GET    /api/quizzes                # Get all user's quizzes
GET    /api/quizzes/:id            # Get quiz by ID
PUT    /api/quizzes/:id            # Update quiz
DELETE /api/quizzes/:id            # Delete quiz
PATCH  /api/quizzes/:id/publish    # Publish/unpublish quiz
GET    /api/quizzes/:id/stats      # Get quiz statistics
```

### Quiz Taking (Public)
```
GET    /api/quizzes/public/:id     # Get published quiz (no auth)
```

### AI Question Generation (HR Only)
```
POST   /api/ai/generate-questions  # Generate questions
Body: { "jobProfile": "React Developer", "numberOfQuestions": 20 }
```

### Quiz Attempts
```
POST   /api/attempts/start                    # Start quiz attempt (public)
POST   /api/attempts/:attemptId/submit        # Submit quiz (public)
GET    /api/attempts/:attemptId               # Get attempt results (public)
GET    /api/attempts/quiz/:quizId             # Get all attempts for quiz (HR)
GET    /api/attempts/:attemptId/details       # Get detailed attempt (HR)
GET    /api/attempts/my-quizzes/all           # Get all attempts across quizzes (HR)
```

## Usage Guide

### For HR Users

1. **Register/Login**
   - Navigate to `/register` or `/login`
   - Create account or sign in

2. **Create Quiz**
   - Click "Create New Quiz" from dashboard
   - Enter quiz details (title, job profile, time limit)
   - Click "Generate Questions with AI"
   - Review and edit generated questions
   - Click "Create Quiz"

3. **Publish Quiz**
   - From dashboard, click "Publish" on a quiz
   - Click "Copy Link" to get shareable URL

4. **View Results**
   - Click "View Attempts" on any quiz
   - See all candidate submissions
   - Click "View Details" for detailed analysis

### For Candidates

1. **Open Quiz Link**
   - Receive link from HR (e.g., `http://localhost:5173/quiz/abc123`)
   - Read instructions and quiz details

2. **Start Quiz**
   - Enter name and email
   - Click "Start Quiz"
   - Timer begins automatically

3. **Take Quiz**
   - Answer all questions
   - Monitor countdown timer
   - Submit before time runs out (or auto-submit)

4. **View Results**
   - See score and correct answers
   - Review question-by-question feedback

## Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-reloads on file changes
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot module replacement enabled
```

### Building for Production

#### Backend
```bash
cd backend
NODE_ENV=production npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected routes for HR operations
- ✅ CORS enabled with proper configuration
- ✅ Input validation on all endpoints
- ✅ MongoDB injection prevention via Mongoose

## Best Practices Implemented

- ✅ ES Modules throughout (no CommonJS)
- ✅ Async/await for asynchronous operations
- ✅ Error handling middleware
- ✅ Clean code architecture
- ✅ RESTful API design
- ✅ React Hooks for state management
- ✅ Context API for global state
- ✅ Responsive design

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS Errors
- Ensure backend CORS is configured correctly
- Check frontend API URL in `.env`

### Timer Not Working
- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache

### AI Generation Fails
- Check if API key is configured (if using OpenAI)
- Verify API quota/limits
- Falls back to template questions if AI fails

## License

MIT License - feel free to use for personal or commercial projects

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API endpoints and error messages

---

Built with ❤️ By Ranveer Jaiswal
