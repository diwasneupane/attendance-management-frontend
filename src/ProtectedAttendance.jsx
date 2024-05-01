import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const PIN_VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const ProtectedAttendance = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedPinData = localStorage.getItem('validPin');

        if (storedPinData) {
            const { pin, expiryTime } = JSON.parse(storedPinData);

            if (Date.now() < expiryTime) {
                navigate('/attendance'); // Redirect to attendance
                return; // Exit after redirecting
            }
        }

    }, [navigate]);

    return null; // No visual output needed
};

export default ProtectedAttendance;
