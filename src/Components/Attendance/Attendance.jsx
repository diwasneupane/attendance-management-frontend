import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSignOut } from '@fortawesome/free-solid-svg-icons';

const baseURL = 'http://localhost:3000/api/v1';


const convertTimeStringToDate = (dateString, timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(dateString);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
};
const Attendance = () => {
    const [formValues, setFormValues] = useState({
        date: '',
        level: '',
        section: '',
    });

    const [periods, setPeriods] = useState(Array.from({ length: 2 }, () => ({
        faculty: '',
        timeIn: '',
        timeOut: '',
    })));

    const [levels, setLevels] = useState([]);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await axios.get(`${baseURL}/level/get-level`);
                setLevels(response.data.data || []);
            } catch (error) {
                toast.error('Error fetching levels');
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`${baseURL}/teacher/get-teachers`);
                setTeachers(response.data.data || []);
            } catch (error) {
                toast.error('Error fetching teachers');
            }
        };

        fetchLevels();
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePeriodChange = (index, field, value) => {
        setPeriods((prev) => {
            const updatedPeriods = [...prev];
            updatedPeriods[index][field] = value;
            return updatedPeriods;
        });
    };

    const addPeriod = () => {
        setPeriods((prev) => [...prev, { faculty: '', timeIn: '', timeOut: '' }]);
    };

    const deletePeriod = (index) => {
        if (periods.length > 1) {
            setPeriods((prev) => prev.filter((_, i) => i !== index));
        } else {
            toast.error('At least one period is required.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.date || !formValues.level || !formValues.section) {
            toast.error('Please fill in Date, Level, and Section!', {
                autoClose: 3000,
                progressBar: true,
            });
            return;
        }

        const attendanceData = {
            date: formValues.date,
            levelId: formValues.level,
            sectionId: formValues.section,
            periods: periods.map((period) => ({
                teacher: period.faculty,
                checkInTime: convertTimeStringToDate(formValues.date, period.timeIn),
                checkOutTime: convertTimeStringToDate(formValues.date, period.timeOut),
            })),
        };

        try {
            const response = await axios.post(`${baseURL}/attendance/create-attendance`, attendanceData);

            if (response.status === 200) {
                toast.success('Attendance record created successfully!');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            toast.error('Error creating attendance record. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-8 pt-4">
            <ToastContainer />
            <div className="w-full max-w-full mx-auto">
                <div className="bg-white p-8 shadow-xl border-[#4F46E5] border-2 border-dashed rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <img src="/src/assets/logo.png" alt="Header" className="w-40 rounded-lg shadow-lg border-2 border-[#4F46E5]" />
                        <h2 className="text-2xl font-semibold text-[#4F46E5]">Period Attendance</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-2 rounded-2xl p-2 border-dashed">
                            <div>
                                <label className="block text-gray-700">Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formValues.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700">Level:</label>
                                <select
                                    name="level"
                                    value={formValues.level}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                >
                                    <option value="">Select Level</option>
                                    {levels.map((level) => (
                                        <option key={level._id} value={level._id}>
                                            {level.level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700">Section:</label>
                                <select
                                    name="section"
                                    value={formValues.section}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                >
                                    <option value="">Select Section</option>
                                    {levels
                                        .find((lvl) => lvl._id === formValues.level)?.sections.map((section) => (
                                            <option key={section._id} value={section._id}>
                                                {section.sectionName}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {periods.map((period, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-100 border-2 border-dashed rounded-2xl shadow-sm flex justify-between items-center"
                                >
                                    <div className="w-1/3 pr-4">
                                        <label className="block text-gray-700">Faculty:</label>
                                        <select
                                            name="faculty"
                                            value={period.faculty}
                                            onChange={(e) => handlePeriodChange(index, 'faculty', e.target.value)}
                                            className="w-full px-4 py-4 rounded-lg bg-gray-200 border border-gray-300"
                                        >
                                            <option value="">Select Faculty</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher._id} value={teacher._id}>
                                                    {teacher.teacherName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-1/3 pr-4">
                                        <label className="block text-gray-700">Time In:</label>
                                        <input
                                            type="time"
                                            value={period.timeIn}
                                            onChange={(e) => handlePeriodChange(index, 'timeIn', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300"
                                        />
                                    </div>

                                    <div class="w-1/3">
                                        <label className="block text-gray-700">Time Out:</label>
                                        <input
                                            type="time"
                                            value={period.timeOut}
                                            onChange={(e) => handlePeriodChange(index, 'timeOut', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300"
                                        />
                                    </div>

                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => deletePeriod(index)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between gap-6">
                            <button
                                type="button"
                                className="w-full py-3 px-6 text-white bg-[#FFA500] rounded-lg hover:bg-indigo-700"
                                onClick={addPeriod}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Period
                            </button>

                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-[#4F46E5] text-white font-semibold rounded-lg hover:bg-indigo-700"
                            >
                                Submit
                            </button>

                            <button
                                type="button"
                                className="w-full py-3 px-6 bg-slate-100 text-black font-semibold rounded-lg border-2 border-dashed border-black flex items-center justify-center hover:border-[#ff7a6e] hover:border-2"
                            >
                                <FontAwesomeIcon icon={faSignOut} className="mr-2" /> Logout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
