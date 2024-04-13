import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const UpdatePin = () => {
    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');

    const handleChangePin = () => {
        // Check if new pin is a number
        if (!/^[0-9]*$/.test(newPin)) {
            toast.error('Please enter numbers only for the new PIN.');
            return;
        }

        // Check if old pin is entered
        if (!oldPin) {
            toast.error('Please enter the old PIN.');
            return;
        }

        // Check if new pin is entered
        if (!newPin) {
            toast.error('Please enter the new PIN.');
            return;
        }

        // Check if PIN length is not more than 4 characters
        if (newPin.length !== 4) {
            toast.error('PIN should be 4 characters long.');
            return;
        }

        // Check if old and new PINs are the same
        if (oldPin === newPin) {
            toast.error('Old and new PIN cannot be the same.');
            return;
        }

        // Change PIN logic here
        // Send oldPin and newPin to backend for verification and update

        // Clear input fields
        setOldPin('');
        setNewPin('');

        // Show success message
        toast.success('PIN changed successfully.');

        // Redirect to opening page after 1 second
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };

    const handleKeyPress = (event) => {
        // Prevent input of non-numeric characters
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        const numericRegex = /^[0-9]+$/;
        if (!numericRegex.test(keyValue)) {
            event.preventDefault();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-sm">
                <div className="flex items-center justify-between mb-8">
                    <img src="/src/assets/logo.png" alt="Logo" className="mx-auto" />
                </div>
                <input
                    type="text"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter old PIN"
                    className="w-full px-4 py-2 mb-2 text-lg bg-gray-200 rounded-lg focus:outline-none focus:bg-white text-center"
                    maxLength={4}
                />
                <input
                    type="text"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new PIN"
                    className="w-full px-4 py-2 mb-2 text-lg bg-gray-200 rounded-lg focus:outline-none focus:bg-white text-center"
                    maxLength={4}
                />
                <button
                    onClick={handleChangePin}
                    className="w-full mt-4 px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                >
                    Update PIN
                </button>
                <div className="flex items-center justify-center mt-4">
                    <button onClick={() => window.history.back()} className="block text-center mt-2 text-indigo-600 hover:text-[#FFA500]">
                        <AiOutlineArrowLeft size={24} className="inline-block mr-1" />
                        Go back
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdatePin;
