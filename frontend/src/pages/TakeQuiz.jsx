import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { formatTime } from '../utils/formatTime';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const TakeQuiz = () => {
  const { id, attemptId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const { colors, gradients, shadows } = useTheme();

  useEffect(() => {
    fetchQuiz();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getPublic(id);
      const quizData = response.data;

      // Validate quiz data
      if (!quizData || !quizData.timeLimitMinutes || !quizData.questions) {
        throw new Error('Invalid quiz data');
      }

      setQuiz(quizData);
      const timeInSeconds = quizData.timeLimitMinutes * 60;
      setTimeLeft(timeInSeconds);
      startTimer(timeInSeconds);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initialTime) => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = async (isTimeout = false) => {
    if (submitting) return;

    setSubmitting(true);
    clearInterval(timerRef.current);

    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

    const formattedAnswers = Object.entries(answers).map(([index, selectedOption]) => ({
      questionIndex: parseInt(index),
      selectedOption
    }));

    try {
      const response = await attemptAPI.submit(attemptId, {
        answers: formattedAnswers,
        timeTakenSeconds: timeTaken,
        isTimeout
      });

      // Navigate to results page
      navigate(`/quiz/${id}/results/${attemptId}`);
    } catch (err) {
      setError('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '20px',
      animation: 'fadeIn 0.5s ease',
    },
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      background: gradients.card,
      padding: '24px',
      borderRadius: '16px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      flexWrap: 'wrap',
      gap: '16px',
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.textPrimary,
      margin: '0',
    },
    subtitle: {
      fontSize: '14px',
      color: colors.textSecondary,
      margin: '5px 0 0 0',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    timerBox: {
      textAlign: 'center',
      padding: '12px 20px',
      background: colors.backgroundSecondary,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
    },
    timer: {
      fontSize: '32px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
    },
    timerLabel: {
      fontSize: '12px',
      color: colors.textSecondary,
      marginTop: '5px',
    },
    progressBar: {
      height: '8px',
      background: colors.backgroundSecondary,
      borderRadius: '4px',
      marginBottom: '20px',
      overflow: 'hidden',
      border: `1px solid ${colors.border}`,
    },
    progressFill: {
      height: '100%',
      background: gradients.success,
      transition: 'width 0.3s ease',
    },
    error: {
      backgroundColor: colors.errorLight,
      color: colors.error,
      padding: '15px 20px',
      borderRadius: '12px',
      marginBottom: '20px',
      border: `1px solid ${colors.error}`,
      animation: 'slideIn 0.3s ease',
    },
    loading: {
      background: gradients.card,
      padding: '40px',
      borderRadius: '16px',
      textAlign: 'center',
      fontSize: '18px',
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      animation: 'pulse 2s ease-in-out infinite',
    },
    questionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '30px',
    },
    questionCard: {
      background: gradients.card,
      padding: '28px',
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      transition: 'all 0.3s ease',
      animation: 'fadeIn 0.6s ease',
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    questionNumber: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: colors.primary,
    },
    answeredBadge: {
      background: gradients.success,
      color: 'white',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
    questionText: {
      fontSize: '16px',
      color: colors.textPrimary,
      marginBottom: '20px',
      lineHeight: '1.5',
      fontWeight: '500',
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    optionLabel: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      border: '2px solid',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: colors.backgroundSecondary,
    },
    radio: {
      marginRight: '12px',
      cursor: 'pointer',
      width: '18px',
      height: '18px',
    },
    optionText: {
      fontSize: '14px',
      color: colors.textPrimary,
      flex: '1',
    },
    submitSection: {
      background: gradients.card,
      padding: '24px',
      borderRadius: '16px',
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.lg} ${colors.shadowColor}`,
      position: 'sticky',
      bottom: '20px',
    },
    submitButton: {
      background: gradients.success,
      color: 'white',
      padding: '14px 40px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
    },
    warning: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginTop: '12px',
      marginBottom: '0',
    },
  });

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.loading}>Loading quiz...</div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>{quiz?.title}</h1>
            <p style={styles.subtitle}>
              Progress: {answeredCount} / {totalQuestions} answered
            </p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.timerBox}>
              <div style={{
                ...styles.timer,
                color: timeLeft < 60 ? colors.error : colors.textPrimary
              }}>
                {formatTime(timeLeft)}
              </div>
              <div style={styles.timerLabel}>Time Remaining</div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${progressPercent}%`
          }} />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.questionsContainer}>
          {quiz?.questions?.map((question, index) => (
            <div key={index} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={styles.questionNumber}>Question {index + 1}</span>
                {answers[index] && (
                  <span style={styles.answeredBadge}>Answered</span>
                )}
              </div>

              <p style={styles.questionText}>{question.questionText}</p>

              <div style={styles.optionsContainer}>
                {question.options?.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    style={{
                      ...styles.optionLabel,
                      backgroundColor: answers[index] === option ? colors.backgroundTertiary : colors.backgroundSecondary,
                      borderColor: answers[index] === option ? colors.primary : colors.border
                    }}
                    onMouseEnter={(e) => {
                      if (answers[index] !== option) {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (answers[index] !== option) {
                        e.currentTarget.style.borderColor = colors.border;
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                      style={styles.radio}
                    />
                    <span style={styles.optionText}>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.submitSection}>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || answeredCount === 0}
            style={styles.submitButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
          {answeredCount < totalQuestions && (
            <p style={styles.warning}>
              You have {totalQuestions - answeredCount} unanswered question(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
