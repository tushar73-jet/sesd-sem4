import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile({ name });
      const updatedUser = res.data.user;
      updateUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <User color="var(--accent)" size={32} />
        Account Settings
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
        {/* Sidebar Sidebar */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.role}</p>
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Settings size={18} /> General
            </li>
            <li 
              role="button"
              onClick={logout}
              style={{ color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={18} /> Sign Out
            </li>
          </ul>
        </div>

        {/* Main Settings Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Edit Profile</h2>
          
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>College Email Domain</label>
              <input 
                type="email" 
                disabled
                value={user?.email}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.2)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-muted)', outline: 'none', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your email is tied to university verification and cannot be changed.</p>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                fontSize: '1rem',
                fontWeight: 500,
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1,
                marginTop: '1rem'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'} <Save size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
