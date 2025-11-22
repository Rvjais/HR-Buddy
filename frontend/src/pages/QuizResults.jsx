import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptAPI } from '../services/api';
import { formatDuration } from '../utils/formatTime';

const QuizResults = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalQuestions = attempt?.quizId?.questions?.length || 0;
  const correctAnswers = attempt?.answers?.filter(a => a.isCorrect).length || 0;
  const score = attempt?.score || 0;

  const getScoreColor = () => {
    if (score >= 70) return '#28a745';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getScoreMessage = () => {
    if (score >= 70) return 'Excellent work!';
    if (score >= 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div style={styles.container}>
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
                  borderLeft: `4px solid ${isCorrect ? '#28a745' : '#dc3545'}`
                }}
              >
                <div style={styles.answerHeader}>
                  <span style={styles.answerNumber}>Question {index + 1}</span>
                  <span style={{
                    ...styles.answerBadge,
                    backgroundColor: isCorrect ? '#28a745' : '#dc3545'
                  }}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p style={styles.answerQuestion}>{question.questionText}</p>

                <div style={styles.answerDetails}>
                  <div style={styles.answerRow}>
                    <strong>Your Answer:</strong>{' '}
                    <span style={{ color: isCorrect ? '#28a745' : '#dc3545' }}>
                      {userAnswer?.selectedOption || 'Not answered'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div style={styles.answerRow}>
                      <strong>Correct Answer:</strong>{' '}
                      <span style={{ color: '#28a745' }}>
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
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '40px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666'
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
    backgroundColor: '#f8f9fa'
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: 'bold'
  },
  scoreLabel: {
    fontSize: '16px',
    color: '#666',
    marginTop: '5px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  detailsSection: {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  detailsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333'
  },
  detailsGrid: {
    display: 'grid',
    gap: '10px',
    fontSize: '14px',
    color: '#666'
  },
  answersSection: {
    marginBottom: '30px'
  },
  answersTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  answerCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  answerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  answerNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#007bff'
  },
  answerBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500'
  },
  answerQuestion: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  answerDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  answerRow: {
    fontSize: '14px',
    color: '#666'
  },
  loading: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#666'
  },
  errorBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
    color: '#666',
    borderTop: '1px solid #e0e0e0'
  }
};

export default QuizResults;
