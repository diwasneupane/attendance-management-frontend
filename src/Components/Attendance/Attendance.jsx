import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Attendance() {
    const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
    const [formValues, setFormValues] = useState({
        date: '',
        checkInTime: '',
        checkOutTime: '',
        level: '',
        section: '',
        teacher: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.date || !formValues.checkInTime || !formValues.checkOutTime || !formValues.level || !formValues.section || !formValues.teacher) {
            toast.error('Please fill in all fields!', {
                autoClose: 3000,
                progressBar: true,
                progressStyle: { backgroundColor: '#FFA500' },
                toastId: 'fillAllFields'
            });
            return;
        }

        // Perform submission logic
        // Here you can make a POST request to your backend with the form data
        // For demonstration purpose, let's just set attendanceSubmitted to true
        setAttendanceSubmitted(true);
    };

    const resetForm = () => {
        setAttendanceSubmitted(false);
        setFormValues({
            date: '',
            checkInTime: '',
            checkOutTime: '',
            level: '',
            section: '',
            teacher: ''
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="mx-auto w-full max-w-2xl py-14">
                <img className="mx-auto h-28 w-auto mb-6" src="/src/assets/logo.png" alt="Logo" />
                <div className="border-b border-solid border-gray-300"></div>
            </div>
            <div className="flex-grow flex justify-center py-4">
                <div className="w-full max-w-2xl">
                    <ToastContainer />
                    {!attendanceSubmitted && (
                        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-wrap">
                            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formValues.date}
                                    onChange={handleChange}
                                    className="block w-full mt-1 px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                                <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">Check-In Time:</label>
                                <input
                                    id="checkInTime"
                                    name="checkInTime"
                                    type="time"
                                    value={formValues.checkInTime}
                                    onChange={handleChange}
                                    className="block w-full mt-1 px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                                <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">Check-Out Time:</label>
                                <input
                                    id="checkOutTime"
                                    name="checkOutTime"
                                    type="time"
                                    value={formValues.checkOutTime}
                                    onChange={handleChange}
                                    className="block w-full mt-1 px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level:</label>
                                <select
                                    id="level"
                                    name="level"
                                    value={formValues.level}
                                    onChange={handleChange}
                                    className="block w-full mt-1 px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select Level</option>
                                    <option value="level 1">Level 1</option>
                                    <option value="level 2">Level 2</option>
                                    <option value="level 3">Level 3</option>
                                </select>
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                                <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section:</label>
                                <select
                                    id="section"
                                    name="section"
                                    value={formValues.section}
                                    onChange={handleChange}
                                    className="block w-full mt-1 px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select Section</option>
                                    <option value="section A">Section A</option>
                                    <option value="section B">Section B</option>
                                    <option value="section C">Section C</option>
                                </select>
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                                <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">Teacher:</label>
                                <select
                                    id="teacher"
                                    name="teacher"
                                    value={formValues.teacher}
                                    onChange={handleChange}
                                    className="block w-full mt-1 px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select Teacher</option>
                                    <option value="teacher 1">Teacher 1</option>
                                    <option value="teacher 2">Teacher 2</option>
                                    <option value="teacher 3">Teacher 3</option>
                                </select>
                            </div>

                            <div className="w-full px-4 mb-6">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit Attendance
                                </button>
                            </div>
                        </div>
                    )}

                    {attendanceSubmitted && (
                        <div className="bg-white p-8 rounded-lg shadow-xl">
                            <h2 className="text-3xl font-bold mb-6 text-indigo-600">Attendance Submitted!</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-lg text-gray-700 mb-2">Date</label>
                                    <input
                                        type="text"
                                        value={formValues.date}
                                        disabled
                                        className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lg text-gray-700 mb-2">Check-In Time</label>
                                    <input
                                        type="text"
                                        value={formValues.checkInTime}
                                        disabled
                                        className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lg text-gray-700 mb-2">Check-Out Time</label>
                                    <input
                                        type="text"
                                        value={formValues.checkOutTime}
                                        disabled
                                        className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lg text-gray-700 mb-2">Level</label>
                                    <input
                                        type="text"
                                        value={formValues.level}
                                        disabled
                                        className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lg text-gray-700 mb-2">Section</label>
                                    <input
                                        type="text"
                                        value={formValues.section}
                                        disabled
                                        className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lg text-gray-700 mb-2">Teacher</label>
                                    <input
                                        type="text"
                                        value={formValues.teacher}
                                        disabled
                                        className="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={resetForm}
                                className="mt-8 block w-full py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Attendance;
