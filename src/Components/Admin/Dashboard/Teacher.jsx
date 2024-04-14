import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// Custom button component with logo
const CustomButton = ({ label, onClick, logo }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center focus:outline-none"
    >
        {logo && (
            <span className="mr-1">
                <FontAwesomeIcon icon={logo} />
            </span>
        )}
        {label}
    </button>
);

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: ""
    });
    const [editingIndex, setEditingIndex] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Please enter a valid teacher name.");
            return;
        }
        if (editingIndex !== null) {
            // If editing, update the teacher name
            const updatedTeachers = [...teachers];
            updatedTeachers[editingIndex] = formData;
            setTeachers(updatedTeachers);
            setFormData({ name: "" });
            setEditingIndex(null);
            toast.success("Teacher updated successfully.");
        } else {
            // If not editing, add a new teacher
            const newTeacher = { ...formData };
            setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
            setFormData({ name: "" });
            toast.success("Teacher added successfully.");
        }
    };

    const handleEdit = (index) => {
        setFormData(teachers[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index) => {
        const teacherName = teachers[index].name;
        confirmAlert({
            title: "Confirm Deletion",
            message: `Are you sure you want to delete ${teacherName}?`,
            buttons: [
                {
                    label: (
                        <CustomButton
                            label="Yes"
                            onClick={() => {
                                setTeachers((prevTeachers) =>
                                    prevTeachers.filter((_, i) => i !== index)
                                );
                                toast.warning(`${teacherName} deleted successfully.`);
                            }}
                            logo={faTrash}
                        />
                    ),
                    onClick: () => { },
                    className:
                        "flex items-center justify-center bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded-md mr-2 focus:outline-none hover:bg-red-500 hover:text-white hover:border-transparent"
                },
                {
                    label: (
                        <CustomButton
                            label="No"
                            onClick={() => { }}
                            logo={faEdit}
                        />
                    ),
                    onClick: () => { },
                    className:
                        "flex items-center justify-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-md focus:outline-none hover:bg-blue-500 hover:text-white hover:border-transparent"
                }
            ]
        });
    };

    return (
        <div className="p-4 sm:ml-64 py-20">
            <ToastContainer />
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
                            {editingIndex !== null ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                    {teachers.map((teacher, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-md p-4 flex justify-between items-center shadow-md hover:shadow-lg transition duration-300"
                        >
                            <div>
                                <h3 className="font-semibold">{teacher.name}</h3>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherManagement;
