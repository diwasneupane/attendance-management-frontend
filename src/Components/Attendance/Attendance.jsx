import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSignOut, faAdd, faBookDead, faHandHoldingWater, faEnvelopeCircleCheck, faTimes, faRecordVinyl, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from 'react-router-dom';

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
    const [attendanceReport, setAttendanceReport] = useState([]);
    const [showAttendanceTable, setShowAttendanceTable] = useState(false);
    const navigate = useNavigate();

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

        if (!confirm("Please recheck the form before submitting")) {
            return
        }

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
                setFormValues({
                    date: '',
                    level: '',
                    section: '',
                })
                setPeriods(Array.from({ length: 2 }, () => ({
                    faculty: '',
                    timeIn: '',
                    timeOut: '',
                })))
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            toast.error('Error creating attendance record. Please try again.');
            console.error(error);
        }
    };

    const handleLogout = () => {
        confirmAlert({
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        localStorage.removeItem('validPin'); // Remove PIN from local storage
                        navigate('/'); // Redirect to the login page or home
                    },
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const toggleAttendanceTable = async () => {
        setShowAttendanceTable((prev) => !prev);
        if (!showAttendanceTable) {
            const currentDate = new Date().toISOString();
            const startTime = new Date(currentDate).setHours(0, 0, 0, 0);
            const endTime = new Date(currentDate).setHours(23, 59, 59, 999);
            const checkInTimeRange = `${new Date(startTime).toISOString()}_${new Date(endTime).toISOString()}`;
            try {
                const response = await axios.get(`${baseURL}/attendance/get-attendance?page=1&limit=5&checkInTimeRange=${checkInTimeRange}`);
                console.log(response)
                setAttendanceReport(response.data.data || []);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-8 pt-4">
            <ToastContainer />
            <div className="w-full max-w-full mx-auto">
                <div className="bg-white p-8 shadow-xl border-2 border-dashed rounded-2xl border-[#4F46E5] ">
                    <div className="flex items-center justify-between mb-8">
                        <img src="/src/assets/logo.png" alt="Header" className="w-40 rounded-lg shadow-lg border-2 border-[#4F46E5]" />
                        <h2 className="text-2xl font-semibold text-[#4F46E5] ml-6 p-2 pt-3 pb-3 rounded-lg shadow-lg border-2 border-[#4F46E5]">Elite Attendance Management</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6  border-2 border-dashed rounded-2xl shadow-sm  justify-between items-center p-4">
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
                                    onChange={(e) => handleChange(e)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none"
                                >
                                    <option value="">Select Section</option>
                                    {levels.find((lvl) => lvl._id === formValues.level)?.sections.map((section) => (
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
                                    <div className="w-1/10 pr-4 border-r border-slate-900 py-4">
                                        <label className="block text-gray-700">Period {index + 1}</label>
                                    </div>
                                    <div className="w-1/4 pr-4">
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

                                    <div className="w-1/4 pr-4">
                                        <label className="block text-gray-700">Time In:</label>
                                        <input
                                            type="time"
                                            value={period.timeIn}
                                            onChange={(e) => handlePeriodChange(index, 'timeIn', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300"
                                        />
                                    </div>

                                    <div className="w-1/4">
                                        <label className="block text-gray-700">Time Out:</label>
                                        <input
                                            type="time"
                                            value={period.timeOut}
                                            onChange={(e) => handlePeriodChange(index, 'timeOut', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300"
                                        />
                                    </div>

                                    <button
                                        className="text-red-500 hover:text-red-700 pl-4 pt-4"
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
                                className="w-full py-3 px-6 bg-slate-100 text-black font-semibold rounded-lg border-2 border-dashed border-black flex items-center justify-center hover:border-[#FFA500] hover:border-2 hover:bg-slate-200"
                                onClick={addPeriod}
                            >
                                <FontAwesomeIcon icon={faHandHoldingWater} className="mr-2 text-[#FFA500] text-2xl" /> Add Period
                            </button>

                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-slate-100 text-black font-semibold rounded-lg border-2 border-dashed border-black flex items-center justify-center hover:border-[#4F46E5] hover:border-2 hover:bg-slate-200"
                            >
                                <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="mr-2 text-[#4F46E5] text-2xl" />
                                Submit
                            </button>

                            <button
                                type="button"
                                className="w-full py-3 px-6 bg-slate-100 text-black font-semibold rounded-lg border-2 border-dashed border-black flex items-center justify-center  over:border-[#ff7a6e] hover:border-2 hover:bg-slate-200"
                                onClick={handleLogout}
                            >
                                <FontAwesomeIcon icon={faSignOut} className="mr-2 text-[#ff7a6e] text-2xl" /> Logout
                            </button>
                            <button
                                type="button"
                                className="w-full py-3 px-6 bg-slate-100 text-black font-semibold rounded-lg border-2 border-dashed border-black flex items-center justify-center  over:border-[#ff7a6e] hover:border-2 hover:bg-slate-200"
                                onClick={toggleAttendanceTable}
                            >
                                <FontAwesomeIcon icon={showAttendanceTable ? faTimes : faReceipt} className="mr-2 text-[#ff7a6e] text-2xl" /> Show Attendance
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showAttendanceTable && (
                <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Attendance Report - {new Date().toDateString()}</h2>
                            <button
                                className="text-gray-600 hover:text-[#ff7a6e] focus:outline-none"
                                onClick={toggleAttendanceTable}
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-4xl" />
                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border border-gray-300">Faculty</th>
                                    <th className="py-2 px-4 border border-gray-300">Time In</th>
                                    <th className="py-2 px-4 border border-gray-300">Time Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceReport.map((attendance, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="py-2 px-4 border border-gray-300">{attendance.teacher}</td>
                                        <td className="py-2 px-4 border border-gray-300">{attendance.checkInTime}</td>
                                        <td className="py-2 px-4 border border-gray-300">{attendance.checkOutTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
