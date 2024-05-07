import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ name: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/teacher/get-teachers');
                const teacherData = (response.data.data || []).map(teacher => ({
                    ...teacher,
                    teacherName: teacher.teacherName.toUpperCase(), // Ensure teacher names are uppercase when fetching
                }));
                setTeachers(teacherData);
            } catch (error) {
                toast.error('Error fetching teachers.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ [name]: value.toUpperCase() }); // Convert to uppercase on input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Please enter a valid teacher name.');
            return;
        }

        setLoading(true);
        if (editingIndex !== null) {
            try {
                const teacherId = teachers[editingIndex]._id;
                await axiosInstance.patch(`/teacher/update-teacher/${teacherId}`, {
                    teacherName: formData.name,
                });
                const updatedTeachers = [...teachers];
                updatedTeachers[editingIndex].teacherName = formData.name; // Update in uppercase
                setTeachers(updatedTeachers);
                setEditingIndex(null);
                setFormData({ name: '' });
                toast.success('Teacher updated successfully.');
            } catch (error) {
                toast.error('Error updating teacher.');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await axiosInstance.post('/teacher/create-teacher', {
                    teacherName: formData.name,
                });
                setTeachers((prev) => [...prev, { ...response.data.data, teacherName: formData.name }]); // Add in uppercase
                setFormData({ name: '' });
                toast.success('Teacher added successfully.');
            } catch (error) {
                toast.error('Error adding teacher.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (index) => {
        setFormData({ name: teachers[index].teacherName });
        setEditingIndex(index);
    };

    const handleDelete = async (index) => {
        const teacherId = teachers[index]._id;

        setLoading(true);
        try {
            await axiosInstance.delete(`/teacher/delete-teacher/${teacherId}`);
            setTeachers((prev) => prev.filter((_, i) => i !== index)); // Remove from list
            toast.success('Teacher deleted successfully.');
        } catch (error) {
            toast.error('Error deleting teacher.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 py-6">
            <ToastContainer autoClose={3000} position="top-right" />
            <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700">
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Teacher Name"
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
                {loading ? (
                    <div className="flex justify-center">
                        <TailSpin color="#0141cf" height={50} width={50} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                        {teachers.length > 0 ? (
                            teachers.map((teacher, index) => (
                                <div
                                    key={teacher._id}
                                    className="border border-gray-300 rounded-md p-4 flex justify-between items-center shadow-md hover:shadow-lg transition duration-300"
                                >
                                    <div>
                                        <h3 className="font-semibold">{teacher.teacherName}</h3> {/* Ensure uppercase */}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="text-blue-500 hover:text-blue-700 focus:outline-none mr-2"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No teachers found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherManagement;
