import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onSuccess: (token: string, email: string, avatar?: string) => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle OAuth redirect token (Google)
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const avatar = searchParams.get('avatar');
    if (token && email) {
      onSuccess(token, email, avatar || undefined);
      window.history.replaceState({}, document.title, '/login');
    }
  }, [searchParams, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(email, password, rememberMe);
      onSuccess(data.token, data.email, data.avatar);
      toast.success('Welcome back!');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, rgba(6,78,59,0.9), rgba(17,94,89,0.9), rgba(22,78,99,0.9)), url('/login-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '1rem',
      position: 'relative' as const,
    },
    card: {
      width: '100%',
      maxWidth: '440px',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      borderRadius: '32px',
      boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      transition: 'transform 0.2s ease',
    },
    header: {
      height: '8px',
      background: 'linear-gradient(90deg, #00A36C, #34d399, #2dd4bf)',
    },
    logoArea: {
      padding: '2rem 2rem 0.5rem 2rem',
      textAlign: 'center' as const,
    },
    logo: {
      width: '90px',
      height: '90px',
      marginBottom: '0.75rem',
      objectFit: 'contain' as const,
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 'clamp(1.8rem, 6vw, 2.2rem)',
      fontWeight: 700,
      color: '#1e293b',
      letterSpacing: '-0.02em',
      margin: 0,
      lineHeight: 1.2,
    },
    subtitle: {
      color: '#64748b',
      fontSize: 'clamp(0.8rem, 4vw, 0.9rem)',
      marginTop: '0.25rem',
      fontWeight: 400,
    },
    form: {
      padding: '2rem',
    },
    inputGroup: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#334155',
      marginBottom: '0.4rem',
    },
    inputWrapper: {
      position: 'relative' as const,
    },
    icon: {
      position: 'absolute' as const,
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      transition: 'color 0.2s',
    },
    input: {
      width: '100%',
      padding: '0.85rem 1rem 0.85rem 2.8rem',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      backgroundColor: '#ffffff',
      fontFamily: 'inherit',
    },
    inputFocus: {
      borderColor: '#00A36C',
      boxShadow: '0 0 0 3px rgba(0, 163, 108, 0.15)',
    },
    eyeButton: {
      position: 'absolute' as const,
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      color: '#475569',
      cursor: 'pointer',
    },
    forgotLink: {
      fontSize: '0.9rem',
      color: '#00A36C',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.2s',
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #00A36C, #047857)',
      color: 'white',
      fontWeight: 600,
      padding: '0.9rem',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.05rem',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.2s',
      boxShadow: '0 10px 20px -8px rgba(0, 163, 108, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      letterSpacing: '0.5px',
    },
    buttonHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 15px 25px -8px rgba(0, 163, 108, 0.6)',
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    divider: {
      position: 'relative' as const,
      margin: '1.8rem 0',
      textAlign: 'center' as const,
    },
    dividerLine: {
      position: 'absolute' as const,
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e2e8f0',
    },
    dividerText: {
      position: 'relative' as const,
      display: 'inline-block',
      padding: '0 1rem',
      backgroundColor: 'white',
      color: '#94a3b8',
      fontSize: '0.9rem',
      fontWeight: 400,
    },
    googleButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      padding: '0.85rem',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      background: '#ffffff',
      color: '#334155',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'background 0.2s, border-color 0.2s',
      fontSize: '0.95rem',
    },
    footer: {
      textAlign: 'center' as const,
      fontSize: '0.8rem',
      color: '#94a3b8',
      marginTop: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}></div>
        <div style={styles.logoArea}>
          <img src="/logo.png" alt="Adansonia" style={styles.logo} />
          <h1 style={styles.title}>Adansonia</h1>
          <p style={styles.subtitle}>Administrator Portal</p>
        </div>

        <div style={styles.form}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.icon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#475569')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div style={styles.row}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#00A36C', width: '16px', height: '16px' }}
                />
                Remember me
              </label>
              <a href="#" style={styles.forgotLink} onMouseEnter={(e) => (e.currentTarget.style.color = '#047857')} onMouseLeave={(e) => (e.currentTarget.style.color = '#00A36C')}>
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.buttonHover)}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(0, 163, 108, 0.5)';
                }
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>Or continue with</span>
          </div>

          {/* Google button */}
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}
            style={styles.googleButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Sign in with Google
          </a>

          <p style={styles.footer}>
            © {new Date().getFullYear()} Adansonia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}