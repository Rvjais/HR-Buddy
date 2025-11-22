import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>HR Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user?.name}</p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/create-quiz" style={styles.createButton}>
            + Create New Quiz
          </Link>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div style={styles.empty}>
          <h2>No quizzes yet</h2>
          <p>Create your first AI-powered interview quiz</p>
          <Link to="/create-quiz" style={styles.createButton}>
            Create Quiz
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{quiz.title}</h3>
                <span style={{
                  ...styles.badge,
                  backgroundColor: quiz.isPublished ? '#28a745' : '#6c757d'
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
                  style={styles.actionButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}/attempts`)}
                  style={styles.actionButton}
                >
                  View Attempts
                </button>
                <button
                  onClick={() => handleTogglePublish(quiz._id)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: quiz.isPublished ? '#ffc107' : '#28a745'
                  }}
                >
                  {quiz.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                {quiz.isPublished && (
                  <button
                    onClick={() => copyQuizLink(quiz._id)}
                    style={{ ...styles.actionButton, backgroundColor: '#17a2b8' }}
                  >
                    Copy Link
                  </button>
                )}
                <button
                  onClick={() => handleDelete(quiz._id)}
                  style={{ ...styles.actionButton, backgroundColor: '#dc3545' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '5px 0 0 0'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  createButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  },
  logoutButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '15px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0',
    flex: '1'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500'
  },
  cardText: {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0'
  },
  cardActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '15px'
  },
  actionButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px'
  }
};

export default Dashboard;
