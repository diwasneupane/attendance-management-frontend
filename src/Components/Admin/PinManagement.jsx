import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Base URL for the API
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // Update with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add authorization token to requests
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
    const [teachers, setTeachers] = useState([]); // Initial empty array for teachers
    const [formData, setFormData] = useState({ name: '' }); // Form data for adding/updating teachers
    const [editingIndex, setEditingIndex] = useState(null); // Index of the teacher being edited

    useEffect(() => {
        console.log('useEffect triggered'); // Log to confirm the effect runs

        const fetchTeachers = async () => {
            try {
                console.log('Fetching teachers...'); // Log when starting to fetch
                const response = await axiosInstance.get('/teacher/get-teachers'); // Ensure correct endpoint
                console.log('Fetch response:', response.data); // Log the response
                setTeachers(response.data.data || []); // Update the state
            } catch (error) {
                console.error('Error fetching teachers:', error); // Log errors
                toast.error('Error fetching teachers');
            }
        };

        fetchTeachers(); // Call the function
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value })); // Update form data
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!formData.name.trim()) {
            toast.error('Please enter a valid teacher name.');
            return;
        }

        if (editingIndex !== null) {
            const teacherId = teachers[editingIndex]._id; // Ensure correct ID is used for update

            try {
                await axiosInstance.patch(`/teacher/update-teacher/${teacherId}`, { name: formData.name }); // Update teacher
                setTeachers((prev) => {
                    const updated = [...prev];
                    updated[editingIndex].name = formData.name; // Update the name in the list
                    return updated;
                });
                setEditingIndex(null); // Reset editing state
                setFormData({ name: '' }); // Clear form
                toast.success('Teacher updated successfully.');
            } catch (error) {
                toast.error('Error updating teacher');
            }
        } else {
            try {
                const response = await axiosInstance.post('/teacher/create-teacher', { name: formData.name }); // Create new teacher
                setTeachers((prev) => [...prev, response.data.data]); // Add to the list
                setFormData({ name: '' }); // Clear form
                toast.success('Teacher added successfully.');
            } catch (error) {
                toast.error('Error adding teacher');
            }
        }
    };

    const handleEdit = (index) => {
        setFormData({ name: teachers[index].name }); // Load existing name into the form
        setEditingIndex(index); // Set the editing index
    };

    const handleDelete = (index) => {
        const teacherId = teachers[index]._id; // Get the correct ID for deletion
        const teacherName = teachers[index].name; // Get the teacher's name

        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete ${teacherName}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axiosInstance.delete(`/teacher/delete-teacher/${teacherId}`); // Delete teacher
                            setTeachers((prev) => prev.filter((_, i) => i !== index)); // Remove from the list
                            toast.success(`${teacherName} deleted successfully.`);
                        } catch (error) {
                            toast.error('Error deleting teacher');
                        }
                    },
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer autoClose={3000} position="top-center" />
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Manage Teachers</h2>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Teacher Name"
                            className="flex-grow p-3 border rounded-md"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600"
                        >
                            {editingIndex !== null ? 'Update' : 'Add'} // Change label based on the context
                        </button>
                    </div>
                </form>

                <div className="mt-4">
                    {teachers.length > 0 ? (
                        teachers.map((teacher, index) => (
                            <div key={index} className="flex justify-between items-center border p-4 rounded-md">
                                <span>{teacher.name}</span>

                                <div className="flex">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="text-blue-500 hover:text-blue-700 ml-2"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No teachers found.</p> // Display message if list is empty
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherManagement;
