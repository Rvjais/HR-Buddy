import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { formatTime } from '../utils/formatTime';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const TakeQuiz = () => {
  const { id, attemptId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  // Reset timer when question changes
  useEffect(() => {
    if (quiz && quiz.questions && quiz.questions[currentQuestionIndex]) {
      const questionTime = quiz.questions[currentQuestionIndex].timeLimitSeconds || 60;
      setTimeLeft(questionTime);
      startTimer();
    }
  }, [currentQuestionIndex, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getPublic(id);
      const quizData = response.data;

      if (!quizData || !quizData.questions) {
        throw new Error('Invalid quiz data');
      }

      setQuiz(quizData);
      // Timer will be started by the useEffect above
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion(true); // Auto-advance on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerChange = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNextQuestion = async (isTimeout = false) => {
    if (submitting) return;

    // Save current answer locally (already done via handleAnswerChange)

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit(isTimeout);
    }
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
      await attemptAPI.submit(attemptId, {
        answers: formattedAnswers,
        timeTakenSeconds: timeTaken,
        isTimeout
      });

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
      position: 'sticky',
      top: '20px',
      zIndex: 100,
    },
    timerBox: {
      textAlign: 'center',
      padding: '12px 20px',
      background: colors.backgroundSecondary,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      minWidth: '120px',
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
    questionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '30px',
    },
    questionCard: (index) => ({
      background: gradients.card,
      padding: '28px',
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      transition: 'all 0.5s ease',
      opacity: index === currentQuestionIndex ? 1 : 0.5,
      filter: index > currentQuestionIndex ? 'blur(5px)' : 'none',
      pointerEvents: index === currentQuestionIndex ? 'auto' : 'none',
      transform: index === currentQuestionIndex ? 'scale(1)' : 'scale(0.98)',
    }),
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
    questionText: {
      fontSize: '18px',
      color: colors.textPrimary,
      marginBottom: '20px',
      lineHeight: '1.5',
      fontWeight: '600',
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
    textArea: {
      width: '100%',
      minHeight: '120px',
      padding: '16px',
      borderRadius: '12px',
      border: `2px solid ${colors.border}`,
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
      fontSize: '16px',
      resize: 'vertical',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    nextButton: {
      background: gradients.primary,
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      float: 'right',
    },
    lockedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.05)',
      borderRadius: '16px',
      zIndex: 10,
    }
  });

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>Loading quiz...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', color: colors.textPrimary }}>{quiz?.title}</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: colors.textSecondary }}>
              Question {currentQuestionIndex + 1} of {quiz?.questions?.length}
            </p>
          </div>
          <div style={styles.timerBox}>
            <div style={{
              ...styles.timer,
              color: timeLeft < 10 ? colors.error : colors.textPrimary
            }}>
              {formatTime(timeLeft)}
            </div>
            <div style={styles.timerLabel}>Time Limit</div>
          </div>
          <ThemeToggle />
        </div>

        <div style={styles.questionsContainer}>
          {quiz?.questions?.map((question, index) => (
            <div key={index} style={styles.questionCard(index)}>
              <div style={styles.questionHeader}>
                <span style={styles.questionNumber}>Question {index + 1}</span>
                {index < currentQuestionIndex && (
                  <span style={{ color: colors.success, fontWeight: 'bold' }}>Answered</span>
                )}
              </div>

              <p style={styles.questionText}>{question.questionText}</p>

              {question.type === 'open' ? (
                <textarea
                  style={{
                    ...styles.textArea,
                    borderColor: answers[index] ? colors.primary : colors.border
                  }}
                  placeholder="Type your answer here..."
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={index !== currentQuestionIndex}
                  onPaste={handlePaste}
                />
              ) : (
                <div style={styles.optionsContainer}>
                  {question.options?.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      style={{
                        ...styles.optionLabel,
                        backgroundColor: answers[index] === option ? colors.backgroundTertiary : colors.backgroundSecondary,
                        borderColor: answers[index] === option ? colors.primary : colors.border,
                        opacity: index !== currentQuestionIndex ? 0.7 : 1,
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(option)}
                        disabled={index !== currentQuestionIndex}
                        style={styles.radio}
                      />
                      <span style={styles.optionText}>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {index === currentQuestionIndex && (
                <button
                  onClick={() => handleNextQuestion(false)}
                  style={styles.nextButton}
                >
                  {index === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </button>
              )}

              {index > currentQuestionIndex && <div style={styles.lockedOverlay} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
