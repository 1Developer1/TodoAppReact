import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './Auth.module.css';

const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2 className={styles.authTitle}>Giriş Yap</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="username"
            placeholder="Kullanıcı adı veya email"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
        
        <p className={styles.toggleText}>
          Hesabınız yok mu?{' '}
          <button 
            type="button" 
            onClick={onToggleMode}
            className={styles.toggleButton}
          >
            Kayıt Ol
          </button>
        </p>

        <div className={styles.testCredentials}>
          <p><strong>Test Hesabı:</strong></p>
          <p>Kullanıcı: testuser</p>
          <p>Şifre: 123456</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
