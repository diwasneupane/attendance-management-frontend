import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Opening from './Components/Attendance/Opening';
import Attendance from './Components/Attendance/Attendance';
import UpdatePin from './Components/Attendance/UpdatePin';
import Login from './Components/Login/Login';
import Layout from './Layout';
import TeacherManagement from './Components/Admin/Dashboard/Teacher';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import AttendanceReport from './Components/Admin/Dashboard/AttendanceReport';
import LevelAndSection from './Components/Admin/Dashboard/LevelAndSection';
import ProtectedRoute from './ProtectedRoutes';
import NotFound from './404NotFound';

function AppRoutes() {
    const authToken = localStorage.getItem('authToken');

    return (
        <Routes>
            <Route path="/" element={<Opening />} />

            {authToken ? (
                <Route path="/login" element={<Navigate to="/admin/dashboard" replace />} />
            ) : (
                <Route path="/login" element={<Login />} />
            )}
            <Route path="/update-pin" element={<UpdatePin />} />
            <Route path="/attendance" element={<Attendance />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Layout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />

                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/level-sections" element={<LevelAndSection />} />
                    <Route path="/admin/teachers" element={<TeacherManagement />} />
                    <Route path="/admin/attendance-report" element={<AttendanceReport />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}


export default AppRoutes;
