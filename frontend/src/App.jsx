import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// HR Pages
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import QuizAttempts from './pages/QuizAttempts';

// Candidate Pages
import QuizWelcome from './pages/QuizWelcome';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate Routes (Public) */}
          <Route path="/quiz/:id" element={<QuizWelcome />} />
          <Route path="/quiz/:id/take/:attemptId" element={<TakeQuiz />} />
          <Route path="/quiz/:id/results/:attemptId" element={<QuizResults />} />

          {/* HR Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/edit"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/attempts"
            element={
              <ProtectedRoute>
                <QuizAttempts />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
