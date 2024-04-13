import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Opening from './Components/Attendance/Opening';
import Attendance from './Components/Attendance/Attendance';
import UpdatePin from './Components/Attendance/UpdatePin';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Opening />} />
            <Route exact path="update-pin" element={<UpdatePin />} />
            <Route path="/attendance" element={<Attendance />} />

            {/* Add more routes as needed */}
        </Routes>
    );
}

export default AppRoutes;
