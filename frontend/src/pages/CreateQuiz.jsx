import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, aiAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [jobProfile, setJobProfile] = useState('');
  const [description, setDescription] = useState('');
  const [defaultTimeLimit, setDefaultTimeLimit] = useState(60);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);
  const [questions, setQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { colors, gradients, shadows } = useTheme();

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
      // Calculate total time limit for backward compatibility
      const totalTimeMinutes = Math.ceil(questions.reduce((acc, q) => acc + (q.timeLimitSeconds || defaultTimeLimit), 0) / 60);

      const response = await quizAPI.create({
        title,
        jobProfile,
        description,
        timeLimitMinutes: totalTimeMinutes, // Kept for schema compatibility
        questions: questions.map(q => ({
          ...q,
          timeLimitSeconds: q.timeLimitSeconds || defaultTimeLimit
        }))
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

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '30px 20px',
      animation: 'fadeIn 0.5s ease',
    },
    wrapper: {
      maxWidth: '900px',
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
    form: {
      background: gradients.card,
      padding: '30px',
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      animation: 'fadeIn 0.6s ease',
    },
    section: {
      marginBottom: '30px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: colors.textPrimary,
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '14px',
      boxSizing: 'border-box',
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '14px',
      boxSizing: 'border-box',
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
      fontFamily: 'inherit',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    generateButton: {
      background: gradients.success,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
    },
    emptyQuestions: {
      textAlign: 'center',
      padding: '60px 40px',
      background: colors.backgroundSecondary,
      borderRadius: '12px',
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
    },
    questionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    questionCard: {
      background: colors.backgroundSecondary,
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    questionNumber: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: colors.primary,
    },
    removeButton: {
      background: gradients.secondary,
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.sm} ${colors.shadowColor}`,
    },
    submitButton: {
      background: gradients.primary,
      color: 'white',
      padding: '14px 30px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create New Quiz</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
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
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
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
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Default Time per Question (seconds)</label>
                <input
                  type="number"
                  value={defaultTimeLimit}
                  onChange={(e) => setDefaultTimeLimit(parseInt(e.target.value) || 60)}
                  required
                  min={10}
                  max={600}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Questions</label>
                <input
                  type="number"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 0)}
                  min={5}
                  max={30}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
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
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
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
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
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
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = colors.border}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Time Limit (seconds)</label>
                      <input
                        type="number"
                        value={q.timeLimitSeconds || defaultTimeLimit}
                        onChange={(e) => updateQuestion(qIndex, 'timeLimitSeconds', parseInt(e.target.value))}
                        style={styles.input}
                        min={10}
                      />
                    </div>

                    {q.type === 'mcq' && (
                      <>
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
                              onFocus={(e) => e.target.style.borderColor = colors.primary}
                              onBlur={(e) => e.target.style.borderColor = colors.border}
                            />
                          ))}
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Correct Answer</label>
                          <select
                            value={q.correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                            style={styles.input}
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = colors.border}
                          >
                            {q.options?.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || questions.length === 0}
            style={styles.submitButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
