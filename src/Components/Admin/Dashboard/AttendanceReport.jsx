import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faDownload,
    faChevronLeft,
    faChevronRight,
    faEdit,
    faTrash,
    faSave,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Base URL for the Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // Adjust as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

const AttendanceReport = () => {
    const [reportData, setReportData] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchLevel, setSearchLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [editingRow, setEditingRow] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        date: '',
        level: '',
        section: '',
        checkIn: '',
        checkOut: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/attendance/get-attendance');

                console.log("Response status:", response.status); // For debugging
                console.log("Response data:", response.data); // Verify structure

                if (
                    response.status === 200 &&
                    response.data &&
                    Array.isArray(response.data.data) // Ensure response contains an array
                ) {
                    setReportData(response.data.data); // Set fetched data
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
                toast.error("Error fetching attendance data.");
                setReportData([]); // Fallback to an empty array in case of error
            }
        };

        fetchData(); // Fetch data when component mounts
    }, []); // Dependency array is empty to avoid re-fetching

    // Filtered data with proper checks
    const filteredData = Array.isArray(reportData)
        ? reportData.filter((item) => {
            const teacherName = item.teacher ? item.teacher.toLowerCase() : '';
            const levelName = item.level ? item.level.toLowerCase() : '';
            return (
                teacherName.includes(searchName.toLowerCase()) &&
                levelName.includes(searchLevel.toLowerCase())
            );
        })
        : [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get('/attendance/get-attendance-excel', {
                responseType: 'blob', // Needed for downloading files
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'attendance_report.xlsx'); // Set the filename
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Download started.');
        } catch (error) {
            toast.error('Error downloading attendance data.');
        }
    };

    const handleEdit = (item) => {
        setEditingRow(item.id);
        setEditForm({
            name: item.teacher,
            date: new Date(item.checkInTime).toLocaleDateString(), // Example date format
            level: item.level,
            section: item.section,
            checkIn: item.checkInTime,
            checkOut: item.checkOutTime,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingRow) {
            toast.error('No record selected for editing.');
            return;
        }

        try {
            await axiosInstance.put(`/attendance/update-attendance/${editingRow}`, editForm);

            setReportData((prev) => prev.map((data) => (data.id === editingRow ? editForm : data)));
            setEditingRow(null); // Reset the editing row
            toast.success('Attendance record updated successfully.');
        } catch (error) {
            toast.error('Error updating attendance record.');
        }
    };

    const handleDelete = (item) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete the record for "${item.teacher}"?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axiosInstance.delete(`/attendance/delete-attendance/${item.id}`);
                            setReportData((prev) => prev.filter((data) => data.id !== item.id));
                            toast.success('Record deleted successfully.');
                        } catch (error) {
                            toast.error('Error deleting attendance record.');
                        }
                    },
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const handleChange = (field, value) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="p-4 py-6">
            <ToastContainer autoClose={3000} position="top-center" />

            <div className="p-4 border-2 border-dotted border-gray-300 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>

                <div className="flex items-center mb-4 gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by Level"
                            value={searchLevel}
                            onChange={(e) => setSearchLevel(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items with pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{indexOfFirstItem + index + 1}</td>
                                    {editingRow === item.id ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        <td>{item.teacher}</td>
                                    )}
                                    {editingRow === item.id ? (
                                        <input
                                            type="text"
                                            value={editForm.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        <td>{new Date(item.checkInTime).toLocaleDateString()}</td>
                                    )}
                                    {editingRow === item.id ? (
                                        <input
                                            type="text"
                                            value={editForm.level}
                                            onChange={(e) => handleChange('level', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        <td>{item.level}</td>
                                    )}
                                    {editingRow === item.id ? (
                                        <input
                                            type="text"
                                            value={editForm.section}
                                            onChange={(e) => handleChange('section', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        <td>{item.section}</td>
                                    )}
                                    {editingRow === item.id ? (
                                        <input
                                            type="text"
                                            value={editForm.checkIn}
                                            onChange={(e) => handleChange('checkIn', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        <td>{item.checkIn}</td>
                                    )}
                                    {editingRow === item.id ? (
                                        <input
                                            type="text"
                                            value={editForm.checkOut}
                                            onChange={(e) => handleChange('checkOut', e.target.value)}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        <td>{item.checkOut}</td>
                                    )}
                                    <td>
                                        {editingRow === item.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={handleSaveEdit}
                                                >
                                                    <FontAwesomeIcon icon={faSave} />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={handleCancelEdit}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${currentItems.length < itemsPerPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Next
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
