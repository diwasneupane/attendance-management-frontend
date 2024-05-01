import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PeriodAttendance = () => {
    const [formValues, setFormValues] = useState({
        date: '',
        level: '',
        section: '',
    });

    const [periods, setPeriods] = useState(Array.from({ length: 10 }, () => ({
        faculty: '',
        timeIn: '',
        timeOut: '',
    })));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePeriodChange = (index, field, value) => {
        setPeriods((prev) => {
            const newPeriods = [...prev];
            newPeriods[index][field] = value;
            return newPeriods;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for required fields
        const missingField = formValues.date === '' || formValues.level === '' || formValues.section === '';
        if (missingField) {
            toast.error('Please fill in Date, Level, and Section!');
            return;
        }

        // Here, add logic to submit data
        console.log('Submit attendance', { formValues, periods });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl">
                <ToastContainer />
                <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Period Attendance</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700">Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formValues.date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700">Level:</label>
                        <select
                            name="level"
                            value={formValues.level}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                        >
                            <option value="">Select Level</option>
                            <option value="Level 1">Level 1</option>
                            <option value="Level 2">Level 2</option>
                            <option value="Level 3">Level 3</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700">Section:</label>
                        <select
                            name="section"
                            value={formValues.section}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                        >
                            <option value="">Select Section</option>
                            <option value="Section A">Section A</option>
                            <option value="Section B">Section B</option>
                            <option value="Section C">Section C</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg text-gray-700 mb-2">Periods</h3>
                        {periods.map((period, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between">
                                <div className="w-1/3">
                                    <label className="block text-gray-700">Faculty:</label>
                                    <select
                                        name="faculty"
                                        value={period.faculty}
                                        onChange={(e) => handlePeriodChange(index, 'faculty', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                    >
                                        <option value="">Select Faculty</option>
                                        <option value="Faculty 1">Faculty 1</option>
                                        <option value="Faculty 2">Faculty 2</option>
                                        <option value="Faculty 3">Faculty 3</option>
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label className="block text-gray-700">Time In:</label>
                                    <input
                                        type="time"
                                        value={period.timeIn}
                                        onChange={(e) => handlePeriodChange(index, 'timeIn', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                    />
                                </div>

                                <div className="w-1/3">
                                    <label className="block text-gray-700">Time Out:</label>
                                    <input
                                        type="time"
                                        value={period.timeOut}
                                        onChange={(e) => handlePeriodChange(index, 'timeOut', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none"
                    >
                        Submit Period Attendance
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PeriodAttendance;
