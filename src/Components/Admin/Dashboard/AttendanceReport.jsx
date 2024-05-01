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
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
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
        teacher: '',
        level: '',
        section: '',
        checkInTime: new Date(),
        checkOutTime: new Date(),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/attendance/get-attendance');
                if (response.status === 200 && Array.isArray(response.data.data)) {
                    setReportData(response.data.data);
                    console.log(response.data.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                toast.error('Error fetching attendance data.');
                setReportData([]);
            }
        };

        fetchData();
    }, []);

    const filteredData = reportData.filter((item) => {
        const teacherName = item.teacher ? item.teacher.toLowerCase() : '';
        const levelName = item.level ? item.level.toLowerCase() : '';
        return (
            teacherName.includes(searchName.toLowerCase()) &&
            levelName.includes(searchLevel.toLowerCase())
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleEdit = (item) => {
        console.log(item);
        setEditingRow(item._id);
        setEditForm({
            teacher: item.teacher,
            level: item.level,
            section: item.section,
            checkInTime: new Date(item.checkInTime),
            checkOutTime: new Date(item.checkOutTime),
        });
    };

    const handleChange = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async () => {
        if (!editingRow) {
            toast.error('No record selected for editing.');
            return;
        }

        try {
            await axiosInstance.put(`/attendance/update-attendance/${editingRow}`, {
                ...editForm,
                checkInTime: editForm.checkInTime.toISOString(),
                checkOutTime: editForm.checkOutTime.toISOString(),
            });

            setReportData((prev) =>
                prev.map((data) => (data._id === editingRow ? { ...editForm, _id: data._id } : data))
            );

            setEditingRow(null);
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
                            await axiosInstance.delete(`/attendance/delete-attendance/${item._id}`);
                            setReportData((prev) => prev.filter((data) => data._id !== item._id));
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

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get('/attendance/get-attendance-excel', {
                responseType: 'blob',
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'attendance_report.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Download started.');
        } catch (error) {
            toast.error('Error downloading attendance report.');
        }
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
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
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
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
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Teacher</th>
                                <th className="px-6 py-3">Level</th>
                                <th className="px-6 py-3">Section</th>
                                <th className="px-6 py-3">Time-In Time</th>
                                <th className="px-6 py-3">Time-Out Time</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, index) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4">{indexOfFirstItem + index + 1}</td>
                                    <td>
                                        {editingRow === item._id ? (
                                            <input
                                                key={`teacher-${item._id}`}
                                                type="text"
                                                value={editForm.teacher}
                                                onChange={(e) => setEditForm({ ...editForm, teacher: e.target.value })}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span key={`view-teacher-${item._id}`}>{item.teacher}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === item._id ? (
                                            <input
                                                key={`level-${item._id}`}
                                                type="text"
                                                value={editForm.level}
                                                onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span key={`view-level-${item._id}`}>{item.level}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === item._id ? (
                                            <input
                                                key={`section-${item._id}`}
                                                type="text"
                                                value={editForm.section}
                                                onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span key={`view-section-${item._id}`}>{item.section}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === item._id ? (
                                            <ReactDatePicker
                                                key={`check-in-${item._id}`}
                                                selected={editForm.checkInTime}
                                                onChange={(date) => setEditForm({ ...editForm, checkInTime: date })}
                                                showTimeSelect
                                                dateFormat="Pp"
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span key={`view-check-in-${item._id}`}>{new Date(item.checkInTime).toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === item._id ? (
                                            <ReactDatePicker
                                                key={`check-out-${item._id}`}
                                                selected={editForm.checkOutTime}
                                                onChange={(date) => setEditForm({ ...editForm, checkOutTime: date })}
                                                showTimeSelect
                                                dateFormat="Pp"
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span key={`view-check-out-${item._id}`}>{new Date(item.checkOutTime).toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === item._id ? (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    key={`save-${item._id}`}
                                                    className="text-green-500"
                                                    onClick={handleSaveEdit}
                                                >
                                                    <FontAwesomeIcon icon={faSave} />
                                                </button>
                                                <button
                                                    key={`cancel-${item._id}`}
                                                    className="text-red-500"
                                                    onClick={() => setEditingRow(null)}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    key={`edit-${item._id}`}
                                                    className="text-blue-500"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    key={`delete-${item._id}`}
                                                    className="text-red-500"
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
                        disabled={currentPage === 1}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentItems.length < itemsPerPage}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md`}
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