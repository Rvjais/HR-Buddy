import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { formatTime } from '../utils/formatTime';

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
      setQuiz(response.data);
      setTimeLeft(response.data.timeLimitMinutes * 60);
      startTimer(response.data.timeLimitMinutes * 60);
    } catch (err) {
      setError('Failed to load quiz');
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading quiz...</div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{quiz?.title}</h1>
          <p style={styles.subtitle}>
            Progress: {answeredCount} / {totalQuestions} answered
          </p>
        </div>
        <div style={styles.timerBox}>
          <div style={{
            ...styles.timer,
            color: timeLeft < 60 ? '#dc3545' : '#333'
          }}>
            {formatTime(timeLeft)}
          </div>
          <div style={styles.timerLabel}>Time Remaining</div>
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
                    backgroundColor: answers[index] === option ? '#e3f2fd' : 'white',
                    borderColor: answers[index] === option ? '#007bff' : '#ddd'
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
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0 0 0'
  },
  timerBox: {
    textAlign: 'center'
  },
  timer: {
    fontSize: '32px',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  timerLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    transition: 'width 0.3s ease'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  loading: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#666'
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px'
  },
  questionCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#007bff'
  },
  answeredBadge: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  questionText: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  radio: {
    marginRight: '12px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  optionText: {
    fontSize: '14px',
    color: '#333',
    flex: '1'
  },
  submitSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    bottom: '20px'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '14px 40px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  warning: {
    fontSize: '14px',
    color: '#856404',
    marginTop: '10px',
    marginBottom: '0'
  }
};

export default TakeQuiz;
