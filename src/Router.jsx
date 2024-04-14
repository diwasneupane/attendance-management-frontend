import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Opening from './Components/Attendance/Opening';
import Attendance from './Components/Attendance/Attendance';
import UpdatePin from './Components/Attendance/UpdatePin';
import Login from './Components/Login/Login';
import Layout from './Layout';
import TeacherManagement from './Components/Admin/Dashboard/Teacher';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import AttendanceReport from './Components/Admin/Dashboard/AttendanceReport';
import LevelAndSection from './Components/Admin/Dashboard/LevelAndSection';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Opening />} />
            <Route exact path="/update-pin" element={<UpdatePin />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<Layout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/level-sections" element={<LevelAndSection />} />
                <Route path="/admin/teachers" element={<TeacherManagement />} />
                <Route path="/admin/attendance-report" element={<AttendanceReport />} />
                {/* <Route path="/logout" element={<AttendanceReport />} /> */}

            </Route>
        </Routes>
    );
}

export default AppRoutes;
