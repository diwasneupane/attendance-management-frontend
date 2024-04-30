import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
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
    const [additionalSections, setAdditionalSections] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedLevel, setEditedLevel] = useState('');
    const [editedSections, setEditedSections] = useState('');

    const fetchLevels = async () => {
        try {
            const response = await axiosInstance.get('/level/get-Level');
            setLevels(response.data.data || []);
        } catch (error) {
            toast.error('Error fetching levels');
        }
    };

    useEffect(() => {
        fetchLevels(); // Fetch levels on component mount
    }, []); // Trigger only once when the component is mounted

    const handleAddLevel = async () => {
        if (newLevel.trim() === '' || newSections.trim() === '') {
            toast.error('Level name and sections are required.');
            return;
        }

        try {
            const sectionsArray = newSections.split(',').map((section) => section.trim());
            const response = await axiosInstance.post('/level/create-level', {
                level: newLevel,
                sections: sectionsArray,
            });

            if (response.data) {
                fetchLevels(); // Re-fetch levels after adding
            }
            setNewLevel('');
            setNewSections('');
            toast.success('Level and sections added successfully.');
        } catch (error) {
            toast.error('Error adding level.');
        }
    };

    const handleAddAdditionalSections = async () => {
        const levelId = levels[editingIndex]?._id;

        if (additionalSections.trim() === '') {
            toast.error('Please enter additional sections.');
            return;
        }

        try {
            const sectionsArray = additionalSections.split(',').map((section) => section.trim());

            await axiosInstance.post('/level/add-section', {
                levelId,
                additionalSections: sectionsArray,
            });

            fetchLevels(); // Refresh the levels after adding new sections
            setAdditionalSections(''); // Clear the input field
            toast.success('Additional sections added successfully.');
        } catch (error) {
            toast.error('Error adding additional sections.');
        }
    };

    const handleEditLevel = (index) => {
        if (index < 0 || index >= levels.length) {
            toast.error('Invalid level index.');
            return;
        }

        const level = levels[index];
        setEditingIndex(index);
        setEditedLevel(level.level);
        setEditedSections(level.sectionNames.join(', '));
        setAdditionalSections(''); // Clear additional sections when editing
    };

    const handleSaveEdit = async () => {
        if (editedLevel.trim() === '') {
            toast.error('Level name cannot be empty.');
            return;
        }

        try {
            const sectionsArray = editedSections.split(',').map((section) => section.trim());
            const levelId = levels[editingIndex]?._id;

            await axiosInstance.patch(`/level/update-level/${levelId}`, {
                level: editedLevel,
                sections: sectionsArray,
            });

            fetchLevels(); // Refresh levels after saving
            setEditingIndex(null); // Reset editing index
            toast.success('Level updated successfully.');
        } catch (error) {
            toast.error('Error updating level.');
        }
    };

    const handleDeleteLevel = async (index) => {
        if (index < 0 || index >= levels.length) {
            toast.error('Invalid level index.');
            return;
        }

        const levelId = levels[index]?._id;

        try {
            await axiosInstance.delete(`/level/delete-level/${levelId}`);
            fetchLevels(); // Refresh after deleting a level
            toast.success('Level deleted successfully.');
        } catch (error) {
            toast.error('Error deleting level.');
        }
    };

    const handleDeleteSection = async (levelIndex, sectionIndex) => {
        if (levelIndex < 0 || levelIndex >= levels.length) {
            toast.error('Invalid level index.');
            return;
        }

        const level = levels[levelIndex];

        if (
            Array.isArray(level.sectionNames) &&
            sectionIndex >= 0 &&
            sectionIndex < level.sectionNames.length
        ) {
            const sectionId = level.sectionNames[sectionIndex];

            try {
                await axiosInstance.delete(`/level/delete-section/${sectionId}`);
                fetchLevels(); // Refresh levels after section deletion
                toast.success('Section deleted successfully.');
            } catch (error) {
                toast.error('Error deleting section.');
            }
        } else {
            toast.error('Invalid section index.');
        }
    };

    return (
        <div className="p-4 py-8 bg-gray-100">
            <ToastContainer autoClose={3000} position="top-center" />
            <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="bg-white p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Add Level and Sections</h2>
                    <input
                        type="text"
                        placeholder="Enter Level Name"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Enter Sections (comma-separated)"
                        value={newSections}
                        onChange={(e) => setNewSections(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <button
                        onClick={handleAddLevel}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Level and Sections
                    </button>
                </div>

                {editingIndex !== null && (
                    <div className="bg-white p-6 rounded-lg mt-6">
                        <h3 className="text-lg font-semibold mb-4">Edit Level and Sections</h3>
                        <input
                            type="text"
                            placeholder="Edit Level Name"
                            value={editedLevel}
                            onChange={(e) => setEditedLevel(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Edit Sections (comma-separated)"
                            value={editedSections}
                            onChange={(e) => setEditedSections(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Add Additional Sections (comma-separated)"
                            value={additionalSections}
                            onChange={(e) => setAdditionalSections(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <button
                            onClick={handleAddAdditionalSections}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Additional Sections
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                            <FontAwesomeIcon icon={faSave} /> Save Changes
                        </button>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg mt-6">
                    {Array.isArray(levels) && levels.length > 0 ? (
                        levels.map((level, index) => (
                            <div key={index} className="mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{level.level}</h3>
                                    <div className="flex">
                                        {editingIndex === index ? (
                                            <button
                                                onClick={handleSaveEdit}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                <FontAwesomeIcon icon={faSave} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditLevel(index)}
                                                className="text-blue-500 hover:text-blue-700 ml-2"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteLevel(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>

                                {Array.isArray(level.sectionNames) && level.sectionNames.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {level.sectionNames.map((section, sectionIndex) => (
                                            <div
                                                key={sectionIndex}
                                                className="bg-gray-200 p-3 rounded-md"
                                            >
                                                <p>{section}</p>
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
                            </div>
                        ))
                    ) : (
                        <p>No levels found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LevelAndSection;
