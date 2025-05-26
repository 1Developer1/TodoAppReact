
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import TodoApp from './TodoApp';
import StatsPage from './StatsPage';
import AuthPage from './AuthPage';
import Navbar from './Navbar';
import './App.css';
import styles from './Auth.module.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <AuthPage />;
};

// Main App Content
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;