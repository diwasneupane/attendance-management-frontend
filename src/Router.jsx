import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Opening from './Components/Attendance/Opening';
import Attendance from './Components/Attendance/Attendance';
import Login from './Components/Login/Login';
import ProtectedRoute from './ProtectedRoutes';
import NotFound from './404NotFound';
import ChangePassword from './Components/Admin/ChangePassword';
import PinManagement from './Components/Admin/PinManagement';
import TeacherManagement from './Components/Admin/Dashboard/Teacher';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import AttendanceReport from './Components/Admin/Dashboard/AttendanceReport';
import LevelAndSection from './Components/Admin/Dashboard/LevelAndSection';

function AppRoutes() {


    const RedirectBasedOnPin = () => {
        const validPin = localStorage.getItem('validPin');

        return validPin ? <Navigate to="/attendance" replace /> : <Opening />;
    };

    const authToken = localStorage.getItem('authToken');

    return (
        <Routes>

            <Route path="/" element={<RedirectBasedOnPin />} />
            <Route path="/attendance" element={<Attendance />} />





            <Route
                path="/login"
                element={authToken ? <Navigate to="/admin/dashboard" replace /> : <Login />}
            />

            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/level-sections" element={<LevelAndSection />} />
                <Route path="/admin/teachers" element={<TeacherManagement />} />
                <Route path="/admin/attendance-report" element={<AttendanceReport />} />
                <Route path="/admin/change-password" element={<ChangePassword />} />
                <Route path="/admin/change-pin" element={<PinManagement />} />
            </Route>


            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;