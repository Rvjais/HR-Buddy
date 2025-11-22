import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? darkColors : lightColors,
    shadows: shadows,
    gradients: isDark ? darkGradients : lightGradients
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

const lightColors = {
  // Backgrounds
  background: '#f0f2f5',
  backgroundSecondary: '#ffffff',
  backgroundTertiary: '#f8f9fa',

  // Text
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // Primary brand
  primary: '#667eea',
  primaryHover: '#5568d3',
  primaryLight: '#e0e7ff',

  // Secondary
  secondary: '#764ba2',
  secondaryHover: '#613a8a',

  // Accent colors
  accent: '#f093fb',
  accentSecondary: '#4facfe',

  // Status colors
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // UI Elements
  border: '#e5e7eb',
  borderHover: '#d1d5db',
  hover: '#f3f4f6',
  disabled: '#9ca3af',

  // Shadows
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowColorStrong: 'rgba(0, 0, 0, 0.15)',
};

const darkColors = {
  // Backgrounds
  background: '#0f0f1e',
  backgroundSecondary: '#1a1a2e',
  backgroundTertiary: '#16213e',

  // Text
  textPrimary: '#f0f0f0',
  textSecondary: '#b0b0b0',
  textTertiary: '#888888',

  // Primary brand
  primary: '#818cf8',
  primaryHover: '#6366f1',
  primaryLight: '#312e81',

  // Secondary
  secondary: '#a78bfa',
  secondaryHover: '#8b5cf6',

  // Accent colors
  accent: '#f093fb',
  accentSecondary: '#4facfe',

  // Status colors
  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#78350f',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#60a5fa',
  infoLight: '#1e3a8a',

  // UI Elements
  border: '#2d3748',
  borderHover: '#4a5568',
  hover: '#252538',
  disabled: '#6b7280',

  // Shadows
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowColorStrong: 'rgba(0, 0, 0, 0.5)',
};

const shadows = {
  sm: '0 1px 2px 0',
  md: '0 4px 6px -1px',
  lg: '0 10px 15px -3px',
  xl: '0 20px 25px -5px',
  '2xl': '0 25px 50px -12px',
  glow: '0 0 20px',
  glowStrong: '0 0 30px',
};

const lightGradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  cool: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  purple: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  card: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
};

const darkGradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  cool: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  card: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
};
