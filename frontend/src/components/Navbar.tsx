import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { School, User, Store, Package, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null; 

  const navLinks = [
    { name: 'Marketplace', path: '/', icon: School },
    { name: 'My Listings', path: '/my-listings', icon: Store },
    { name: 'My Orders', path: '/my-orders', icon: Package },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (user.role === 'ADMIN') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldAlert });
  }

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)' }}>
          <div style={{ background: 'var(--accent)', padding: '0.2rem', borderRadius: '6px' }}>
            <School size={18} color="#0f172a" />
          </div>
          <span className="desktop-only">CampusKart</span>
          <span className="mobile-only" style={{ fontSize: '0.9rem' }}>CK</span>
        </Link>

        <ul style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2.5rem)', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link 
                  to={link.path}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'color 0.2s',
                    fontSize: '0.85rem'
                  }}
                  title={link.name}
                >
                  <Icon size={18} />
                  <span className="desktop-only">{link.name}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button 
              onClick={logout}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                transition: 'color 0.2s',
                padding: '0.2rem'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Logout"
            >
              <span className="desktop-only">Logout</span>
              <span className="mobile-only" style={{ fontWeight: 600 }}>Exit</span>
            </button>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
