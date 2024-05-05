import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faEdit,
    faTrash,
    faSave,
} from "@fortawesome/free-solid-svg-icons";
import { TailSpin } from 'react-loader-spinner'; // Import TailSpin loader

// Custom styling to hide number input arrows in different browsers
const numberInputStyle = {
    WebkitAppearance: "none", // Hide arrows in Chrome/Safari
    MozAppearance: "textfield", // Hide arrows in Firefox
    appearance: "none", // Hide arrows in Edge/IE
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const PinManagement = () => {
    const [pins, setPins] = useState([]);
    const [newPin, setNewPin] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedPin, setEditedPin] = useState("");
    const [validationError, setValidationError] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        const fetchPins = async () => {
            try {
                setLoading(true); // Set loading state when fetching pins
                const response = await axiosInstance.get("/pin/view");
                setPins(response.data.data || []);
            } catch (error) {
                toast.error("Error fetching PINs.");
            } finally {
                setLoading(false); // Reset loading state after fetching pins
            }
        };

        fetchPins();
    }, []);

    const handleNewPinChange = (e) => {
        const value = e.target.value;
        if (value.length > 4) {
            setValidationError("PIN must be exactly 4 digits.");
        } else {
            setValidationError("");
        }
        setNewPin(value);
    };

    const handleAddPin = async () => {
        if (newPin.trim().length !== 4) {
            toast.error("PIN must be exactly 4 digits.");
            return;
        }

        confirmAlert({
            title: "Confirm Action",
            message: "Are you sure you want to add this PIN?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            setLoading(true); // Set loading state when adding pin
                            const response = await axiosInstance.post("/pin/add", {
                                pin: newPin,
                            });
                            setPins((prev) => [
                                ...prev,
                                { _id: response.data.data._id, pin: newPin },
                            ]);
                            setNewPin("");
                            toast.success("PIN added successfully.");
                        } catch (error) {
                            toast.error("Error adding PIN.");
                        } finally {
                            setLoading(false); // Reset loading state after adding pin
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleEditPin = (index) => {
        setEditingIndex(index);
        setEditedPin(pins[index].pin);
    };

    const handleEditedPinChange = (e) => {
        const value = e.target.value;
        if (value.length <= 4) {
            setEditedPin(value);
        } else {
            setValidationError("PIN must be exactly 4 digits.");
        }
    };

    const handleSaveEdit = async () => {
        if (editedPin.trim().length !== 4) {
            toast.error("PIN must be exactly 4 digits.");
            return;
        }

        confirmAlert({
            title: "Confirm Action",
            message: "Are you sure you want to update this PIN?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        const pinId = pins[editingIndex]._id;
                        try {
                            setLoading(true); // Set loading state when saving edit
                            await axiosInstance.put(`/pin/update/${pinId}`, {
                                newPin: editedPin,
                            });
                            setPins((prev) => {
                                const updated = [...prev];
                                updated[editingIndex].pin = editedPin;
                                return updated;
                            });
                            setEditingIndex(null);
                            toast.success("PIN updated successfully.");
                        } catch (error) {
                            toast.error("Error updating PIN.");
                        } finally {
                            setLoading(false); // Reset loading state after saving edit
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleDeletePin = async (index) => {
        const pinId = pins[index]._id;

        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this PIN?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            setLoading(true); // Set loading state when deleting pin
                            await axiosInstance.delete(`/pin/delete/${pinId}`);
                            setPins((prev) => prev.filter((_, i) => i !== index));
                            toast.success("PIN deleted successfully.");
                        } catch (error) {
                            toast.error("Error deleting PIN.");
                        } finally {
                            setLoading(false); // Reset loading state after deleting pin
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    return (
        <div className="p-6  flex justify-center items-center">
            <ToastContainer autoClose={3000} position="top-center" />

            <div
                className="bg-white p-8 border-2 border-dashed border-gray-300 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Manage PINs</h2>

                <div className="mb-6">
                    <input
                        type="number"
                        placeholder="Enter new PIN"
                        value={newPin}
                        onChange={handleNewPinChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={numberInputStyle}
                    />
                    {validationError && (
                        <p className="text-red-500 text-sm">{validationError}</p>
                    )}
                    <button
                        onClick={handleAddPin}
                        className="mt-3 bg-indigo-500 text-white px-5 py-3 rounded-md hover:bg-indigo-600 transition-all duration-200 w-full"
                    >
                        {loading ? <TailSpin color="#fff" height={20} width={20} /> : (
                            <>
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add PIN
                            </>
                        )}
                    </button>
                </div>

                {pins.length > 0 ? (
                    <div className="space-y-4">
                        {pins.map((pin, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border-b pb-4"
                            >
                                {editingIndex === index ? (
                                    <input
                                        type="number"
                                        value={editedPin}
                                        onChange={handleEditedPinChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        style={numberInputStyle}
                                    />
                                ) : (
                                    <span className="text-lg">{pin.pin}</span>
                                )}

                                <div className="flex items-center space-x-2">
                                    {editingIndex === index ? (
                                        <button
                                            onClick={handleSaveEdit}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEditPin(index)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeletePin(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No PINs found.</p>
                )}
            </div>
        </div>
    );
};

export default PinManagement;
