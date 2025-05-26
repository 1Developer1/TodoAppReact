import React from 'react';
import { useSelector } from 'react-redux';
import AuthPage from './Auth/AuthPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return children;
};

export default ProtectedRoute;