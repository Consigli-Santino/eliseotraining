import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, path }) => {
    const { isAuthenticated, loading, hasAccess } = useAuth();

   
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

   
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

  
    if (!hasAccess(path)) {
        return <Navigate to="/unauthorized" replace />;
    }

  
    return children;
};

export default ProtectedRoute;