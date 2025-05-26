import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './Auth.module.css';

const RegisterForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2 className={styles.authTitle}>Kayıt Ol</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="username"
            placeholder="Kullanıcı adı"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Şifre Tekrar"
            value={formData.confirmPassword}
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
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>
        
        <p className={styles.toggleText}>
          Zaten hesabınız var mı?{' '}
          <button 
            type="button" 
            onClick={onToggleMode}
            className={styles.toggleButton}
          >
            Giriş Yap
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
