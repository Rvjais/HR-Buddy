import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { colors, gradients, shadows } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: '20px',
      position: 'relative',
      animation: 'fadeIn 0.5s ease',
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
    },
    card: {
      background: gradients.card,
      padding: '50px 40px',
      borderRadius: '20px',
      boxShadow: `${shadows.xl} ${colors.shadowColorStrong}`,
      width: '100%',
      maxWidth: '450px',
      border: `1px solid ${colors.border}`,
      animation: 'fadeIn 0.6s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    cardGlow: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: gradients.secondary,
      opacity: '0.03',
      transform: 'rotate(45deg)',
      pointerEvents: 'none',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
      background: gradients.secondary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      fontSize: '15px',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: '35px',
    },
    error: {
      backgroundColor: colors.errorLight,
      color: colors.error,
      padding: '12px 16px',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      border: `1px solid ${colors.error}`,
      animation: 'slideIn 0.3s ease',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    },
    formGroup: {
      marginBottom: '20px',
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
      fontSize: '15px',
      boxSizing: 'border-box',
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    button: {
      background: gradients.secondary,
      color: 'white',
      padding: '14px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `${shadows.md} ${colors.shadowColor}`,
      marginTop: '10px',
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center',
      fontSize: '14px',
      color: colors.textSecondary,
      position: 'relative',
      zIndex: 1,
    },
    link: {
      color: colors.primary,
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.2s ease',
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.themeToggle}>
        <ThemeToggle />
      </div>
      <div style={styles.card}>
        <div style={styles.cardGlow}></div>
        <h1 style={styles.title}>Create HR Account</h1>
        <p style={styles.subtitle}>Start creating AI-powered interview quizzes</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              placeholder="John Doe"
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="your@email.com"
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="At least 6 characters"
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
