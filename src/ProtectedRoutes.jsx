import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        console.log('ProtectedRoute component mounted');
        return () => {
            console.log('ProtectedRoute component unmounted');
        };
    }, []);

    console.log('ProtectedRoute: authToken:', authToken);

    if (!authToken) {
        console.log('ProtectedRoute: Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    console.log('ProtectedRoute: Authenticated, rendering Layout');
    return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
