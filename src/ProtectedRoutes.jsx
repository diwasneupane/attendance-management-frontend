import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Components/Admin/SideNav'; // Sidebar component
import Header from './Components/Admin/Header'; // Header component

const ProtectedRoute = () => {
    const authToken = localStorage.getItem('authToken'); // Retrieve auth token from local storage

    if (!authToken) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar with fixed width */}
            <Sidebar />

            <div className="flex flex-1 flex-col">
                {/* Header at the top */}
                <Header />

                {/* Main content where the child routes are displayed */}
                <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                    <Outlet /> {/* This renders the child routes */}
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute;
