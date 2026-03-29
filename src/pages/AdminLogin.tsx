import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onSuccess: (token: string, email: string, avatar?: string) => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(email, password, rememberMe);
      onSuccess(data.token, data.email, data.avatar);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // 1. Fixed the undefined bug with a robust fallback
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    // 2. Log this to your browser console to verify it's correct
    console.log("Redirecting to Backend Auth:", `${backendUrl}/api/auth/google`);
    
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, rgba(6,78,59,0.9), rgba(17,94,89,0.9), rgba(22,78,99,0.9)), url('/login-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '1rem',
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
    },
    header: {
      height: '8px',
      background: 'linear-gradient(90deg, #00A36C, #34d399, #2dd4bf)',
    },
    logoArea: { padding: '2rem 2rem 0.5rem 2rem', textAlign: 'center' },
    logo: { width: '90px', height: '90px', marginBottom: '0.75rem', objectFit: 'contain' },
    title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#1e293b', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' },
    form: { padding: '2rem' },
    inputGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#334155', marginBottom: '0.4rem' },
    inputWrapper: { position: 'relative' },
    icon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    input: { width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '1rem' },
    eyeButton: { position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
    button: { width: '100%', background: 'linear-gradient(135deg, #00A36C, #047857)', color: 'white', fontWeight: 600, padding: '0.9rem', border: 'none', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    googleButton: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#ffffff', color: '#334155', fontWeight: 500, cursor: 'pointer' },
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
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.icon} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" style={styles.input} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={styles.input} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={styles.row}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', cursor: 'pointer' }}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: '#00A36C', width: '16px', height: '16px' }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: '0.9rem', color: '#00A36C', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} style={loading ? { ...styles.button, opacity: 0.6 } : styles.button}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '1.8rem 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ position: 'relative', display: 'inline-block', padding: '0 1rem', backgroundColor: 'white', color: '#94a3b8', fontSize: '0.9rem' }}>Or continue with</span>
          </div>

          <button onClick={handleGoogleLogin} style={styles.googleButton}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px', height: '20px' }} />
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2rem' }}>
            © {new Date().getFullYear()} Adansonia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}