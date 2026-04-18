import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/admin.service';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Package, ShoppingCart, Ban, CheckCircle, Activity } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  soldProducts: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers()
      ]);
      setStats(statsRes.stats);
      setUsersList(usersRes.users);
    } catch (error) {
      console.error('Failed to load admin dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const handleToggleSuspension = async (userId: string, currentStatus: boolean) => {
    try {
      await adminService.toggleSuspension(userId, !currentStatus);
      // Optimistic upate
      setUsersList(usersList.map(u => u.id === userId ? { ...u, isSuspended: !currentStatus } : u));
    } catch (error) {
      console.error('Failed to toggle suspension', error);
      alert('Failed to update user status.');
    }
  };

  // Extra security guard in case the frontend route accidentally renders
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
          <ShieldAlert size={32} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', lineHeight: 1.2 }}>Platform Administration</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor marketplace activity and user accounts</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Gathering intelligence...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)', borderRadius: '12px' }}><Users size={24} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Users</p><h3 style={{ fontSize: '1.5rem' }}>{stats?.totalUsers || 0}</h3></div>
            </motion.div>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '12px' }}><Package size={24} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Products</p><h3 style={{ fontSize: '1.5rem' }}>{stats?.totalProducts || 0}</h3></div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '12px' }}><ShoppingCart size={24} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Order Volume</p><h3 style={{ fontSize: '1.5rem' }}>{stats?.totalOrders || 0}</h3></div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px' }}><Activity size={24} /></div>
              <div><p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sold Out</p><h3 style={{ fontSize: '1.5rem' }}>{stats?.soldProducts || 0}</h3></div>
            </motion.div>
          </div>

          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>User Directory</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Email</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Joined</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{u.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--accent)' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: u.role === 'ADMIN' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.1)', color: u.role === 'ADMIN' ? '#a855f7' : 'white' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        {u.role === 'ADMIN' ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cannot suspend admin</span>
                        ) : u.isSuspended ? (
                          <button 
                            onClick={() => handleToggleSuspension(u.id, u.isSuspended)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                          >
                            <CheckCircle size={16} /> Unsuspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleSuspension(u.id, u.isSuspended)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                          >
                            <Ban size={16} /> Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
