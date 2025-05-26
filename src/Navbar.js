// Navbar.js
import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Auth.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        🚀 Todo App with JWT
      </div>
      
      <div className={styles.navbarUser}>
        <div className={styles.userInfo}>
          <span>👤 {user?.username}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleNavigation('/')}
            className={`${styles.logoutButton} ${location.pathname === '/' ? styles.activeNavButton : ''}`}
            style={{ 
              background: location.pathname === '/' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            📝 Todos
          </button>
          
          <button
            onClick={() => handleNavigation('/stats')}
            className={`${styles.logoutButton} ${location.pathname === '/stats' ? styles.activeNavButton : ''}`}
            style={{ 
              background: location.pathname === '/stats' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            📊 İstatistikler
          </button>
        </div>
        
        <button onClick={handleLogout} className={styles.logoutButton}>
          🚪 Çıkış
        </button>
      </div>
    </nav>
  );
};

export default Navbar;