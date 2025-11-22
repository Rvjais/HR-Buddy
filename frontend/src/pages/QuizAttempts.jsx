import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { formatDuration } from '../utils/formatTime';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const QuizAttempts = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { colors, gradients, shadows } = useTheme();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [quizResponse, attemptsResponse] = await Promise.all([
        quizAPI.getById(id),
        attemptAPI.getQuizAttempts(id)
      ]);
      setQuiz(quizResponse.data);
      setAttempts(attemptsResponse.data);
    } catch (err) {
      setError('Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (attemptId) => {
    navigate(`/attempt/${attemptId}/details`);
  };

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '30px 20px',
      animation: 'fadeIn 0.5s ease',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '30px',
      background: gradients.card,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.lg} ${colors.shadowColor}`,
      flexWrap: 'wrap',
      gap: '16px',
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0',
    },
    subtitle: {
      fontSize: '16px',
      color: colors.textSecondary,
      margin: '5px 0 0 0',
    },
    headerActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: colors.backgroundTertiary,
      color: colors.textPrimary,
      padding: '12px 24px',
      borderRadius: '12px',
      border: `2px solid ${colors.border}`,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
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
      textAlign: 'center',
      padding: '60px',
      fontSize: '18px',
      color: colors.textSecondary,
      background: gradients.card,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      animation: 'pulse 2s ease-in-out infinite',
    },
    empty: {
      textAlign: 'center',
      padding: '80px 40px',
      background: gradients.card,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.lg} ${colors.shadowColor}`,
    },
    emptyTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: '12px',
    },
    emptyText: {
      fontSize: '16px',
      color: colors.textSecondary,
    },
    tableContainer: {
      background: gradients.card,
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      overflow: 'auto',
      animation: 'fadeIn 0.6s ease',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '18px 15px',
      textAlign: 'left',
      borderBottom: `2px solid ${colors.border}`,
      background: colors.backgroundSecondary,
      fontWeight: '600',
      fontSize: '14px',
      color: colors.textPrimary,
    },
    tr: {
      borderBottom: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    td: {
      padding: '18px 15px',
      fontSize: '14px',
      color: colors.textSecondary,
    },
    scoreBadge: {
      padding: '6px 14px',
      borderRadius: '20px',
      color: 'white',
      fontWeight: '600',
      fontSize: '13px',
      display: 'inline-block',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
    statusBadge: {
      padding: '6px 14px',
      borderRadius: '20px',
      color: 'white',
      fontWeight: '600',
      fontSize: '12px',
      display: 'inline-block',
      textTransform: 'capitalize',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
    viewButton: {
      background: gradients.info,
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
  });

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{quiz?.title}</h1>
          <p style={styles.subtitle}>Quiz Attempts ({attempts.length})</p>
        </div>
        <div style={styles.headerActions}>
          <ThemeToggle />
          <button
            onClick={() => navigate('/dashboard')}
            style={styles.backButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {attempts.length === 0 ? (
        <div style={styles.empty}>
          <h2 style={styles.emptyTitle}>No attempts yet</h2>
          <p style={styles.emptyText}>Candidates haven't taken this quiz yet.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Candidate</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Time Taken</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Submitted</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr
                  key={attempt._id}
                  style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.backgroundSecondary}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={styles.td}>{attempt.candidateName}</td>
                  <td style={styles.td}>{attempt.candidateEmail}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.scoreBadge,
                      background: attempt.score >= 70 ? gradients.success : attempt.score >= 50 ? gradients.warm : gradients.secondary
                    }}>
                      {attempt.score.toFixed(1)}%
                    </span>
                  </td>
                  <td style={styles.td}>{formatDuration(attempt.timeTakenSeconds)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      background: attempt.status === 'completed' ? gradients.success : gradients.secondary
                    }}>
                      {attempt.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(attempt.submittedAt).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => viewDetails(attempt._id)}
                      style={styles.viewButton}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuizAttempts;
