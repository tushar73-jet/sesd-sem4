import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { School, User, Store, Package, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null; // Don't show nav on login pages

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
        zIndex: 100,
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>
        <div style={{ background: 'var(--accent)', padding: '0.25rem', borderRadius: '8px' }}>
          <School size={20} color="#0f172a" />
        </div>
        CampusKart
      </Link>

      <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
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
                  gap: '0.5rem', 
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.2s',
                  fontSize: '0.875rem'
                }}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default Navbar;
