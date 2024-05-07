// Opening Component (Handling PIN input and storage)
import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEye, AiFillEyeInvisible, AiOutlineSetting } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const baseURL = 'http://localhost:3000/api/v1';
const PIN_VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const Opening = () => {
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const [pins, setPins] = useState(['', '', '', '']);
    const [showPin, setShowPin] = useState(false);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        const newPins = [...pins];
        newPins[index] = value;
        setPins(newPins);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus(); // Move to the next input
        } else if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus(); // Move back if deleting
        }
    };

    const handleSubmit = async () => {
        const pin = pins.join('');
        if (pin.length < 4) {
            toast.error('Please enter a 4-digit PIN.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/pin/validate`, { pin });
            if (response.status === 200) {
                const hashedPin = CryptoJS.SHA256(pin).toString();
                const expiryTime = Date.now() + PIN_VALIDITY_PERIOD;

                localStorage.setItem(
                    'validPin',
                    JSON.stringify({ pin: hashedPin, expiryTime })
                );

                const currentTime = Date.now();
                if (currentTime > expiryTime) {
                    localStorage.removeItem('validPin');
                    navigate('/');
                    return;
                }
                toast.success('PIN is valid!');
                navigate('/attendance');
            } else {
                throw new Error('Invalid PIN');
            }
        } catch (error) {
            toast.error('Invalid PIN. Please try again.');
            setPins(['', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-sm">
                <img src="/src/assets/logo.png" alt="Logo" className="mx-auto mb-8" />
                <div className="grid grid-cols-4 gap-2">
                    {pins.map((pin, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type={showPin ? 'text' : 'password'}
                            value={pins[index]}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="w-full px-4 py-2 text-lg text-center bg-gray-200 rounded-lg"
                            maxLength={1}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-2">
                    {showPin ? (
                        <AiFillEyeInvisible
                            size={24}
                            onClick={() => setShowPin(false)}
                            className="cursor-pointer"
                        />
                    ) : (
                        <AiFillEye
                            size={24}
                            onClick={() => setShowPin(true)}
                            className="cursor-pointer"
                        />
                    )}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full mt-4 px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                    Submit
                </button>

            </div>
            <ToastContainer autoClose={3000} />
        </div>
    );
};

export default Opening;
