import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = () => {
    const authToken = localStorage.getItem('authToken');

    return authToken ? <Layout /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
