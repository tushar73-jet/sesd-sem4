import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { School, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <School size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to access your marketplace</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>College Email (.edu)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }}
              placeholder="student@university.edu"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.875rem', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: '500',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'var(--primary)')}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '500' }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
