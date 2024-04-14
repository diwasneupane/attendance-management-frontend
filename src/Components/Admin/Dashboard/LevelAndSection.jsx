import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function LevelAndSection() {
    const [levels, setLevels] = useState([
        {
            id: 1,
            name: 'Level 1',
            sections: ['Section A', 'Section B', 'Section C']
        },
        {
            id: 2,
            name: 'Level 2',
            sections: ['Section D', 'Section E']
        }
    ]);

    const [newLevel, setNewLevel] = useState('');
    const [newSections, setNewSections] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedLevel, setEditedLevel] = useState('');
    const [editedSections, setEditedSections] = useState('');

    const handleAddLevel = () => {
        if (newLevel.trim() !== '' && newSections.trim() !== '') {
            if (levels.some(level => level.name === newLevel)) {
                toast.error('Level name already exists!');
                return;
            }
            const sectionsArray = newSections.split(',').map(section => section.trim());
            const newLevelObject = {
                id: levels.length + 1,
                name: newLevel,
                sections: sectionsArray
            };
            setLevels([...levels, newLevelObject]);
            setNewLevel('');
            setNewSections('');
            toast.success('Level and sections added successfully!');
        } else {
            toast.error('Please fill in both fields!');
        }
    };

    const handleEditLevel = (levelIndex) => {
        setEditingIndex(levelIndex);
        setEditedLevel(levels[levelIndex].name);
        setEditedSections(levels[levelIndex].sections.join(', '));
    };

    const handleSaveEdit = () => {
        const updatedLevels = [...levels];
        updatedLevels[editingIndex].name = editedLevel;
        updatedLevels[editingIndex].sections = editedSections.split(',').map(section => section.trim());
        setLevels(updatedLevels);
        setEditingIndex(null);
    };

    const handleDeleteLevel = (levelIndex) => {
        confirmAlert({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this level?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const updatedLevels = levels.filter((_, index) => index !== levelIndex);
                        setLevels(updatedLevels);
                        toast.warning('Level deleted successfully.');
                    },
                    className:
                        "flex items-center justify-center bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded-md mr-2 focus:outline-none hover:bg-red-500 hover:text-white hover:border-transparent"

                },
                {
                    label: 'No',
                    onClick: () => { },
                    className:
                        "flex items-center justify-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-md focus:outline-none hover:bg-blue-500 hover:text-white hover:border-transparent"

                }
            ]
        });
    };

    const handleDeleteSection = (levelIndex, sectionIndex) => {
        const updatedLevels = [...levels];
        updatedLevels[levelIndex].sections.splice(sectionIndex, 1);
        setLevels(updatedLevels);
    };

    return (
        <div className="p-4 sm:ml-64 py-20 bg-gray-100">
            <ToastContainer />
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="bg-white p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Add Level and Sections</h2>
                    <input
                        type="text"
                        placeholder="Enter Level Name"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Enter Sections (comma separated)"
                        value={newSections}
                        onChange={(e) => setNewSections(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleAddLevel}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Level and Sections
                    </button>
                </div>
                <div className='py-2' />
                <div className="bg-white p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Levels</h2>
                    {levels.map((level, levelIndex) => (
                        <div key={level.id} className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                {editingIndex === levelIndex ? (
                                    <input
                                        type="text"
                                        value={editedLevel}
                                        onChange={(e) => setEditedLevel(e.target.value)}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <h3 className="text-lg font-semibold">{level.name}</h3>
                                )}
                                <div className="flex">
                                    {editingIndex === levelIndex ? (
                                        <button
                                            onClick={handleSaveEdit}
                                            className="text-green-500 hover:text-green-700 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEditLevel(levelIndex)}
                                            className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteLevel(levelIndex)}
                                        className="text-red-500 hover:text-red-700 ml-2 focus:outline-none"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {level.sections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="bg-gray-200 p-3 rounded-md">
                                        <p>{section}</p>
                                        <button
                                            onClick={() => handleDeleteSection(levelIndex, sectionIndex)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LevelAndSection;
