import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import mongoose from 'mongoose';
import { confirmAlert } from 'react-confirm-alert';
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

const LevelAndSection = () => {
    const [levels, setLevels] = useState([]);
    const [newLevel, setNewLevel] = useState('');
    const [newSections, setNewSections] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editedLevel, setEditedLevel] = useState('');
    const [editedSections, setEditedSections] = useState('');
    const [additionalSections, setAdditionalSections] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLevels = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/level/get-level');
            const levelsData = response.data.data;
            setLevels(levelsData || []);
            if (!levelsData || levelsData.length === 0) {
                toast.info('No level found.');
            }
        } catch (error) {
            toast.error('Failed to fetch levels.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    const handleAddLevel = async () => {
        if (newLevel.trim() === '' || newSections.trim() === '') {
            return toast.error('Please enter level name and sections.');
        }

        setLoading(true);
        try {
            const sectionsArray = newSections.split(',').map((section) => section.trim().toUpperCase());
            const existingLevel = levels.find((level) => level.level.toUpperCase() === newLevel.trim().toUpperCase());

            if (existingLevel) {
                return toast.error('Level already exists.');
            }

            await axiosInstance.post('/level/create-level', {
                level: newLevel.trim().toUpperCase(),
                sections: sectionsArray,
            });

            fetchLevels();
            setNewLevel('');
            setNewSections('');
            toast.success('Level added successfully.');
        } catch (error) {
            console.error('Error adding level:', error);
            toast.error('Failed to add level. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditLevel = (index) => {
        if (index < 0 || index >= levels.length) {
            toast.error('Invalid level index.');
            return;
        }

        setEditIndex(index);
        setIsEditing(true);
        setEditedLevel(levels[index]?.level);
        setEditedSections(levels[index]?.sections.map((s) => s.sectionName).join(', '));
        setAdditionalSections('');
    };

    const handleSaveEdit = async () => {
        if (editedLevel.trim() === '') {
            toast.error('Level name cannot be empty.');
            return;
        }

        const isLevelNameConflict = levels.some((lvl, idx) => idx !== editIndex && lvl.level.toUpperCase() === editedLevel.trim().toUpperCase());
        if (isLevelNameConflict) {
            toast.error('Level name already exists.');
            return;
        }

        setLoading(true);
        try {
            const sectionsArray = editedSections.split(',').map((section) => section.trim().toUpperCase());
            const levelId = levels[editIndex]?._id;

            await axiosInstance.patch(`/level/update-level/${levelId}`, {
                level: editedLevel.trim().toUpperCase(),
                sections: sectionsArray,
            });

            fetchLevels();
            setIsEditing(false);
            setEditIndex(null);
            toast.success('Level updated successfully.');
        } catch (error) {
            toast.error('Error updating level.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdditionalSections = async () => {
        const levelId = levels[editIndex]?._id;

        if (additionalSections.trim() === '') {
            return toast.error('Please enter additional sections.');
        }

        setLoading(true);
        try {
            const sectionsArray = additionalSections.split(',').map((section) => section.trim().toUpperCase());
            const existingSections = levels[editIndex]?.sections.map((section) => section.sectionName.toUpperCase());

            const duplicateSections = sectionsArray.filter((section) => existingSections.includes(section));
            if (duplicateSections.length > 0) {
                return toast.error(`Sections already exist in this level: ${duplicateSections.join(', ')}`);
            }

            await axiosInstance.post('/level/add-section', {
                levelId,
                additionalSections: sectionsArray,
            });

            fetchLevels();
            setAdditionalSections('');
            toast.success('Additional sections added successfully.');
        } catch (error) {
            console.error('Error adding additional sections:', error);
            toast.error('Failed to add additional sections. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLevel = async (index) => {
        const levelId = levels[index]?._id;

        if (!levelId) {
            toast.error('Invalid level ID.');
            return;
        }

        setLoading(true);
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this level?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axiosInstance.delete(`/level/delete-level/${levelId}`);
                            setLevels(levels.filter((_, i) => i !== index));
                            toast.success('Level deleted successfully.');
                        } catch (error) {
                            console.error('Error deleting level:', error);
                            toast.error('Error deleting level.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
                {
                    label: 'No',
                    onClick: () => {
                        setLoading(false);
                    },
                },
            ],
        });
    };

    const handleDeleteSection = async (levelIndex, sectionIndex) => {
        const sectionId = levels[levelIndex]?.sections[sectionIndex]?._id;

        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            toast.error('Invalid section ID.');
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.delete(`/level/delete-section/${sectionId}`);
            fetchLevels();
            toast.success('Section deleted successfully.');
        } catch (error) {
            toast.error('Error deleting section.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 py-8 bg-gray-100 min-h-screen">
            <ToastContainer autoClose={3000} position="top-center" />

            <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Level and Section Management</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter New Level"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Sections (comma-separated)"
                        value={newSections}
                        onChange={(e) => setNewSections(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <button
                    onClick={handleAddLevel}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Level and Sections
                </button>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TailSpin color="#0141cf" height={50} width={50} />
                        </div>
                    </div>
                ) : (
                    Array.isArray(levels) && levels.length > 0 ? (
                        levels.map((level, index) => (
                            <div key={index} className="mb-6 bg-white rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{level.level}</h3>
                                    <div className="flex">
                                        <button
                                            onClick={() => handleEditLevel(index)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLevel(index)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>

                                {Array.isArray(level.sections) && level.sections.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {level.sections.map((section, sectionIndex) => (
                                            <div key={sectionIndex} className="bg-gray-200 p-3 rounded-md flex justify-between items-center">
                                                <p>{section.sectionName}</p>
                                                <button
                                                    onClick={() => handleDeleteSection(index, sectionIndex)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No sections found.</p>
                                )}

                                {isEditing && editIndex === index && (
                                    <div className="mt-4 bg-gray-100 p-4 rounded-lg border-2 border-dashed">
                                        <h4 className="text-lg font-semibold mb-3">Edit Level and Add New Sections</h4>
                                        <input
                                            type="text"
                                            placeholder="Edit Level Name"
                                            value={editedLevel}
                                            onChange={(e) => setEditedLevel(e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <div className='p-2'></div>
                                        <input
                                            type="text"
                                            placeholder="Add Additional Sections (comma-separated)"
                                            value={additionalSections}
                                            onChange={(e) => setAdditionalSections(e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <div className='p-2'></div>

                                        <button
                                            onClick={handleAddAdditionalSections}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            Add Sections
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No levels found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default LevelAndSection;
