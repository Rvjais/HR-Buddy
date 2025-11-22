import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';

const QuizWelcome = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getPublic(id);
      setQuiz(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Quiz not found or not available');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setStarting(true);

    try {
      const response = await attemptAPI.start({
        quizId: id,
        candidateName: name,
        candidateEmail: email
      });

      // Navigate to quiz page with attempt ID
      navigate(`/quiz/${id}/take/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start quiz');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading quiz...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{quiz?.title}</h1>
        <p style={styles.subtitle}>Position: {quiz?.jobProfile}</p>

        {quiz?.description && (
          <p style={styles.description}>{quiz.description}</p>
        )}

        <div style={styles.infoBox}>
          <div style={styles.infoItem}>
            <strong>Number of Questions:</strong> {quiz?.questions?.length}
          </div>
          <div style={styles.infoItem}>
            <strong>Time Limit:</strong> {quiz?.timeLimitMinutes} minutes
          </div>
          <div style={styles.infoItem}>
            <strong>Question Type:</strong> Multiple Choice
          </div>
        </div>

        <div style={styles.instructions}>
          <h3 style={styles.instructionsTitle}>Instructions:</h3>
          <ul style={styles.instructionsList}>
            <li>You will have {quiz?.timeLimitMinutes} minutes to complete the quiz</li>
            <li>The quiz will auto-submit when time runs out</li>
            <li>You cannot pause or resume the quiz once started</li>
            <li>Make sure you have a stable internet connection</li>
            <li>Answer all questions to the best of your ability</li>
          </ul>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleStart} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <button type="submit" disabled={starting} style={styles.startButton}>
            {starting ? 'Starting Quiz...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#333'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '20px'
  },
  description: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  infoItem: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '10px'
  },
  instructions: {
    marginBottom: '30px'
  },
  instructionsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333'
  },
  instructionsList: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.8',
    paddingLeft: '20px'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  errorBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  loading: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontSize: '18px',
    color: '#666'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  startButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default QuizWelcome;
