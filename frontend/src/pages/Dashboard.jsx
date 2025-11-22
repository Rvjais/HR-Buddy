import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { quizAPI } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const { colors, gradients, shadows } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAll();
      setQuizzes(response.data);
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await quizAPI.delete(id);
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (err) {
      alert('Failed to delete quiz');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const response = await quizAPI.togglePublish(id);
      setQuizzes(quizzes.map(q => q._id === id ? response.data : q));
    } catch (err) {
      alert('Failed to update quiz');
    }
  };

  const copyQuizLink = (quizId) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    alert('Quiz link copied to clipboard!');
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
      marginBottom: '40px',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '30px',
      background: gradients.card,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.lg} ${colors.shadowColor}`,
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '16px',
      color: colors.textSecondary,
      margin: '0',
    },
    headerActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    createButton: {
      background: gradients.primary,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      transition: 'all 0.3s ease',
    },
    logoutButton: {
      backgroundColor: colors.backgroundTertiary,
      color: colors.textPrimary,
      padding: '12px 24px',
      borderRadius: '12px',
      border: `2px solid ${colors.border}`,
      cursor: 'pointer',
      fontSize: '15px',
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
      marginBottom: '30px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
    },
    card: {
      background: gradients.card,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      transition: 'all 0.3s ease',
      animation: 'fadeIn 0.6s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    cardGlow: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '4px',
      background: gradients.primary,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '16px',
      gap: '12px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: colors.textPrimary,
      margin: '0',
      flex: '1',
    },
    badge: {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      color: 'white',
      fontWeight: '600',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
    cardText: {
      fontSize: '14px',
      color: colors.textSecondary,
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    cardActions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: `1px solid ${colors.border}`,
    },
    actionButton: {
      color: 'white',
      padding: '8px 14px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>HR Dashboard</h1>
            <p style={styles.subtitle}>Welcome, {user?.name}</p>
          </div>
          <div style={styles.headerActions}>
            <Link
              to="/create-quiz"
              style={styles.createButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              + Create New Quiz
            </Link>
            <ThemeToggle />
            <button
              onClick={logout}
              style={styles.logoutButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div style={styles.empty}>
            <h2 style={styles.emptyTitle}>No quizzes yet</h2>
            <p style={styles.emptyText}>Create your first AI-powered interview quiz</p>
            <Link
              to="/create-quiz"
              style={styles.createButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Create Quiz
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `${shadows.lg} ${colors.shadowColorStrong}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `${shadows.md} ${colors.shadowColor}`;
                }}
              >
                <div style={styles.cardGlow}></div>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{quiz.title}</h3>
                  <span style={{
                    ...styles.badge,
                    background: quiz.isPublished ? gradients.success : `linear-gradient(135deg, ${colors.disabled} 0%, ${colors.textTertiary} 100%)`
                  }}>
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p style={styles.cardText}>
                  <strong>Job Profile:</strong> {quiz.jobProfile}
                </p>
                <p style={styles.cardText}>
                  <strong>Questions:</strong> {quiz.questions?.length || 0}
                </p>
                <p style={styles.cardText}>
                  <strong>Time Limit:</strong> {quiz.timeLimitMinutes} minutes
                </p>
                <p style={styles.cardText}>
                  <strong>Created:</strong> {new Date(quiz.createdAt).toLocaleDateString()}
                </p>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
                    style={{ ...styles.actionButton, background: gradients.info }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}/attempts`)}
                    style={{ ...styles.actionButton, background: gradients.primary }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    View Attempts
                  </button>
                  <button
                    onClick={() => handleTogglePublish(quiz._id)}
                    style={{
                      ...styles.actionButton,
                      background: quiz.isPublished ? gradients.warm : gradients.success
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    {quiz.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  {quiz.isPublished && (
                    <button
                      onClick={() => copyQuizLink(quiz._id)}
                      style={{ ...styles.actionButton, background: gradients.cool }}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      Copy Link
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    style={{ ...styles.actionButton, background: gradients.secondary }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
