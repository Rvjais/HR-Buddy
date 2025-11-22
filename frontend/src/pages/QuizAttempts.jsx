import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { formatDuration } from '../utils/formatTime';

const QuizAttempts = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{quiz?.title}</h1>
          <p style={styles.subtitle}>Quiz Attempts ({attempts.length})</p>
        </div>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          Back to Dashboard
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {attempts.length === 0 ? (
        <div style={styles.empty}>
          <h2>No attempts yet</h2>
          <p>Candidates haven't taken this quiz yet.</p>
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
                <tr key={attempt._id} style={styles.tr}>
                  <td style={styles.td}>{attempt.candidateName}</td>
                  <td style={styles.td}>{attempt.candidateEmail}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.scoreBadge,
                      backgroundColor: attempt.score >= 70 ? '#28a745' : attempt.score >= 50 ? '#ffc107' : '#dc3545'
                    }}>
                      {attempt.score.toFixed(1)}%
                    </span>
                  </td>
                  <td style={styles.td}>{formatDuration(attempt.timeTakenSeconds)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: attempt.status === 'completed' ? '#28a745' : '#dc3545'
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
    marginBottom: '30px'
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
  backButton: {
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333'
  },
  tr: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    color: '#666'
  },
  scoreBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '500',
    fontSize: '13px',
    display: 'inline-block'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '500',
    fontSize: '12px',
    display: 'inline-block',
    textTransform: 'capitalize'
  },
  viewButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px'
  }
};

export default QuizAttempts;
