import React, { useRef, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEye, AiFillEyeInvisible, AiOutlineSetting } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Opening = () => {
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const [pins, setPins] = useState(['', '', '', '']);
    const [showPin, setShowPin] = useState(false);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) {
            toast.error('Please enter numbers only.');
            return;
        }

        const newPins = [...pins];
        newPins[index] = value;
        setPins(newPins);

        if (value === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && pins[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const pin = pins.join('');
        if (!pin) {
            toast.error('Please enter your PIN.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/pin/validate`);
            console.log(response);
            if (response.status === 200) {
                toast.success('PIN is valid!');
                navigate('/attendance');
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
                            value={pin}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-full px-4 py-2 text-lg text-center bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                            maxLength={1}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-2">
                    {showPin ? (
                        <AiFillEyeInvisible size={24} onClick={() => setShowPin(false)} />
                    ) : (
                        <AiFillEye size={24} onClick={() => setShowPin(true)} />
                    )}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full mt-4 px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                >
                    Submit
                </button>
                <Link to="/update-pin" className="block text-center mt-2 text-indigo-600 hover:text-[#FFA500]">
                    <AiOutlineSetting size={24} className="inline-block mr-1" />
                    Change PIN
                </Link>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Opening;
