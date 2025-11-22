import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, aiAPI } from '../services/api';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [jobProfile, setJobProfile] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);
  const [questions, setQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerateQuestions = async () => {
    if (!jobProfile) {
      setError('Please enter a job profile first');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await aiAPI.generateQuestions({
        jobProfile,
        numberOfQuestions
      });
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (questions.length === 0) {
      setError('Please generate questions first');
      return;
    }

    setLoading(true);

    try {
      const response = await quizAPI.create({
        title,
        jobProfile,
        description,
        timeLimitMinutes,
        questions
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Quiz</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          Back to Dashboard
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quiz Details</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quiz Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
              placeholder="e.g., React Developer Interview"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Job Profile *</label>
            <input
              type="text"
              value={jobProfile}
              onChange={(e) => setJobProfile(e.target.value)}
              required
              style={styles.input}
              placeholder="e.g., React Developer, Node.js Engineer"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              placeholder="Brief description of the quiz..."
              rows={3}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Time Limit (minutes) *</label>
              <input
                type="number"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
                required
                min={5}
                max={60}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Questions</label>
              <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                min={5}
                max={30}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Questions</h2>
            <button
              type="button"
              onClick={handleGenerateQuestions}
              disabled={generating}
              style={styles.generateButton}
            >
              {generating ? 'Generating...' : '✨ Generate Questions with AI'}
            </button>
          </div>

          {questions.length === 0 ? (
            <div style={styles.emptyQuestions}>
              <p>No questions yet. Click "Generate Questions with AI" to get started.</p>
            </div>
          ) : (
            <div style={styles.questionsList}>
              {questions.map((q, qIndex) => (
                <div key={qIndex} style={styles.questionCard}>
                  <div style={styles.questionHeader}>
                    <span style={styles.questionNumber}>Question {qIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Question Text</label>
                    <textarea
                      value={q.questionText}
                      onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                      style={styles.textarea}
                      rows={2}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Options</label>
                    {q.options?.map((opt, optIndex) => (
                      <input
                        key={optIndex}
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                        style={{ ...styles.input, marginBottom: '8px' }}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    ))}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Correct Answer</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                      style={styles.input}
                    >
                      {q.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || questions.length === 0}
          style={styles.submitButton}
        >
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
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
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '30px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  generateButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  emptyQuestions: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#666'
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  questionCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  questionNumber: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#007bff'
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px'
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '14px 30px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    width: '100%'
  }
};

export default CreateQuiz;
