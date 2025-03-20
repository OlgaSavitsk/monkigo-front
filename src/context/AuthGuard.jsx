import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthGuard = ({ children }) => {
    const { userData, checkTokenExpiration } = useAuth();
    const isTokenExpired = checkTokenExpiration(userData);

    if (isTokenExpired) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default AuthGuard;