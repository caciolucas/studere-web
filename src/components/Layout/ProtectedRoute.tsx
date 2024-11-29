import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useAuth();
    return token ? <>{children}</> : <Navigate to="/login" />;
    //return <>{children}</>;
};

export default ProtectedRoute;
