import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptAPI } from '../services/api';
import { formatDuration } from '../utils/formatTime';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const QuizResults = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { colors, gradients, shadows } = useTheme();

  useEffect(() => {
    fetchResults();
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const response = await attemptAPI.getById(attemptId);
      setAttempt(response.data);
    } catch (err) {
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '30px 20px',
      position: 'relative',
      animation: 'fadeIn 0.5s ease',
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    card: {
      background: gradients.card,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.xl} ${colors.shadowColorStrong}`,
      padding: '50px 40px',
      animation: 'fadeIn 0.6s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '18px',
      color: colors.textSecondary,
      fontWeight: '500',
    },
    scoreCircle: {
      width: '200px',
      height: '200px',
      margin: '0 auto 40px',
      borderRadius: '50%',
      border: '8px solid',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.backgroundSecondary,
      boxShadow: `${shadows.lg} ${colors.shadowColor}`,
    },
    scoreValue: {
      fontSize: '48px',
      fontWeight: 'bold',
    },
    scoreLabel: {
      fontSize: '16px',
      color: colors.textSecondary,
      marginTop: '5px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '20px',
      marginBottom: '40px',
    },
    statCard: {
      textAlign: 'center',
      padding: '24px',
      background: colors.backgroundSecondary,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: '5px',
    },
    statLabel: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    detailsSection: {
      marginBottom: '40px',
      padding: '24px',
      background: colors.backgroundSecondary,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
    },
    detailsTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: colors.textPrimary,
    },
    detailsGrid: {
      display: 'grid',
      gap: '10px',
      fontSize: '14px',
      color: colors.textSecondary,
    },
    answersSection: {
      marginBottom: '30px',
    },
    answersTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: colors.textPrimary,
    },
    answerCard: {
      background: colors.backgroundSecondary,
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '15px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    answerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    answerNumber: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: colors.primary,
    },
    answerBadge: {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      color: 'white',
      fontWeight: '600',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
    answerQuestion: {
      fontSize: '16px',
      color: colors.textPrimary,
      marginBottom: '15px',
      lineHeight: '1.5',
      fontWeight: '500',
    },
    answerDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    answerRow: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    loading: {
      background: gradients.card,
      padding: '40px',
      borderRadius: '20px',
      textAlign: 'center',
      fontSize: '18px',
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      animation: 'pulse 2s ease-in-out infinite',
    },
    errorBox: {
      background: gradients.card,
      padding: '40px',
      borderRadius: '20px',
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
    },
    footer: {
      textAlign: 'center',
      padding: '24px',
      fontSize: '14px',
      color: colors.textSecondary,
      borderTop: `1px solid ${colors.border}`,
    },
  });

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.themeToggle}>
          <ThemeToggle />
        </div>
        <div style={styles.wrapper}>
          <div style={styles.loading}>Loading results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.themeToggle}>
          <ThemeToggle />
        </div>
        <div style={styles.wrapper}>
          <div style={styles.errorBox}>
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = attempt?.quizId?.questions?.length || 0;
  const correctAnswers = attempt?.answers?.filter(a => a.isCorrect).length || 0;
  const score = attempt?.score || 0;

  const getScoreColor = () => {
    if (score >= 70) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  const getScoreGradient = () => {
    if (score >= 70) return gradients.success;
    if (score >= 50) return gradients.warm;
    return gradients.secondary;
  };

  const getScoreMessage = () => {
    if (score >= 70) return 'Excellent work!';
    if (score >= 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div style={styles.container}>
      <div style={styles.themeToggle}>
        <ThemeToggle />
      </div>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Quiz Completed!</h1>
            <p style={styles.subtitle}>{attempt?.quizId?.title}</p>
          </div>

          <div style={{
            ...styles.scoreCircle,
            borderColor: getScoreColor()
          }}>
          <div style={{
            ...styles.scoreValue,
            color: getScoreColor()
          }}>
            {score.toFixed(1)}%
          </div>
          <div style={styles.scoreLabel}>{getScoreMessage()}</div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{correctAnswers}</div>
            <div style={styles.statLabel}>Correct Answers</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalQuestions - correctAnswers}</div>
            <div style={styles.statLabel}>Incorrect Answers</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statValue}>{formatDuration(attempt?.timeTakenSeconds || 0)}</div>
            <div style={styles.statLabel}>Time Taken</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {attempt?.status === 'completed' ? 'On Time' : 'Timeout'}
            </div>
            <div style={styles.statLabel}>Status</div>
          </div>
        </div>

        <div style={styles.detailsSection}>
          <h2 style={styles.detailsTitle}>Your Details</h2>
          <div style={styles.detailsGrid}>
            <div>
              <strong>Name:</strong> {attempt?.candidateName}
            </div>
            <div>
              <strong>Email:</strong> {attempt?.candidateEmail}
            </div>
            <div>
              <strong>Submitted:</strong> {new Date(attempt?.submittedAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={styles.answersSection}>
          <h2 style={styles.answersTitle}>Question Review</h2>
          {attempt?.quizId?.questions?.map((question, index) => {
            const userAnswer = attempt?.answers?.find(a => a.questionIndex === index);
            const isCorrect = userAnswer?.isCorrect;

            return (
              <div
                key={index}
                style={{
                  ...styles.answerCard,
                  borderLeft: `4px solid ${isCorrect ? colors.success : colors.error}`
                }}
              >
                <div style={styles.answerHeader}>
                  <span style={styles.answerNumber}>Question {index + 1}</span>
                  <span style={{
                    ...styles.answerBadge,
                    background: isCorrect ? gradients.success : gradients.secondary
                  }}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p style={styles.answerQuestion}>{question.questionText}</p>

                <div style={styles.answerDetails}>
                  <div style={styles.answerRow}>
                    <strong>Your Answer:</strong>{' '}
                    <span style={{ color: isCorrect ? colors.success : colors.error }}>
                      {userAnswer?.selectedOption || 'Not answered'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div style={styles.answerRow}>
                      <strong>Correct Answer:</strong>{' '}
                      <span style={{ color: colors.success }}>
                        {question.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.footer}>
          <p>Thank you for taking this quiz. The HR team will review your results.</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
