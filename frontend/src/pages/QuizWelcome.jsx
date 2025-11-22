import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const QuizWelcome = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { colors, gradients, shadows } = useTheme();

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

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: '20px',
      position: 'relative',
      animation: 'fadeIn 0.5s ease',
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
    },
    card: {
      background: gradients.card,
      padding: '50px 40px',
      borderRadius: '20px',
      boxShadow: `${shadows.xl} ${colors.shadowColorStrong}`,
      width: '100%',
      maxWidth: '650px',
      border: `1px solid ${colors.border}`,
      animation: 'fadeIn 0.6s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    cardGlow: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: gradients.primary,
      opacity: '0.03',
      transform: 'rotate(45deg)',
      pointerEvents: 'none',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      fontSize: '18px',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: '20px',
      fontWeight: '500',
    },
    description: {
      fontSize: '14px',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    infoBox: {
      background: colors.backgroundSecondary,
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '30px',
      border: `1px solid ${colors.border}`,
    },
    infoItem: {
      fontSize: '14px',
      color: colors.textPrimary,
      marginBottom: '12px',
    },
    instructions: {
      marginBottom: '30px',
    },
    instructionsTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: colors.textPrimary,
    },
    instructionsList: {
      fontSize: '14px',
      color: colors.textSecondary,
      lineHeight: '1.8',
      paddingLeft: '20px',
    },
    error: {
      backgroundColor: colors.errorLight,
      color: colors.error,
      padding: '12px 16px',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      border: `1px solid ${colors.error}`,
      animation: 'slideIn 0.3s ease',
    },
    errorBox: {
      background: gradients.card,
      padding: '40px',
      borderRadius: '20px',
      boxShadow: `${shadows.xl} ${colors.shadowColorStrong}`,
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
    },
    loading: {
      background: gradients.card,
      padding: '40px',
      borderRadius: '20px',
      boxShadow: `${shadows.xl} ${colors.shadowColorStrong}`,
      textAlign: 'center',
      fontSize: '18px',
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      animation: 'pulse 2s ease-in-out infinite',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: colors.textPrimary,
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '15px',
      boxSizing: 'border-box',
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    startButton: {
      background: gradients.success,
      color: 'white',
      padding: '14px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
    },
  });

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.themeToggle}>
          <ThemeToggle />
        </div>
        <div style={styles.loading}>Loading quiz...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div style={styles.container}>
        <div style={styles.themeToggle}>
          <ThemeToggle />
        </div>
        <div style={styles.errorBox}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.themeToggle}>
        <ThemeToggle />
      </div>
      <div style={styles.card}>
        <div style={styles.cardGlow}></div>
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
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
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
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <button
            type="submit"
            disabled={starting}
            style={styles.startButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {starting ? 'Starting Quiz...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizWelcome;
