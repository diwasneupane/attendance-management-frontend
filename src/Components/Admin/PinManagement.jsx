import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import { TailSpin } from "react-loader-spinner";

const numberInputStyle = {
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "none",
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

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
    const [loading, setLoading] = useState(false);

    const fetchPins = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/pin/view");
            setPins(response.data.data || []);
        } catch (error) {
            toast.error("Error fetching PINs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPins();
    }, []);

    const isUniquePin = (pin) => !pins.some((p) => p.pin === pin);

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

        if (!isUniquePin(newPin)) {
            toast.error("This PIN already exists. Please enter a unique PIN.");
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
                            setLoading(true);
                            await axiosInstance.post("/pin/add", { pin: newPin });
                            fetchPins(); // Refresh the list after adding
                            toast.success("PIN added successfully.");
                        } catch (error) {
                            toast.error("Error adding PIN.");
                        } finally {
                            setLoading(false);
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
        if (value.length > 4) {
            setValidationError("PIN must be exactly 4 digits.");
        } else {
            setValidationError("");
        }
        setEditedPin(value);
    };

    const handleSaveEdit = async () => {
        if (editedPin.trim().length !== 4) {
            toast.error("PIN must be exactly 4 digits.");
            return;
        }

        // Check if the edited PIN is unique in the list (excluding the current one)
        if (!isUniquePin(editedPin) && pins[editingIndex].pin !== editedPin) {
            toast.error("This PIN already exists. Please enter a unique PIN.");
            return;
        }

        confirmAlert({
            title: "Confirm Action",
            message: "Are you sure you want to update this PIN?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            setLoading(true);
                            await axiosInstance.put(`/pin/update/${pins[editingIndex]._id}`, {
                                newPin: editedPin,
                            });
                            fetchPins(); // Refresh the list after updating
                            setEditingIndex(null);
                            toast.success("PIN updated successfully.");
                        } catch (error) {
                            toast.error("Error updating PIN.");
                        } finally {
                            setLoading(false);
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
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this PIN?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            setLoading(true);
                            await axiosInstance.delete(`/pin/delete/${pins[index]._id}`);
                            fetchPins(); // Refresh the list after deletion
                            toast.success("PIN deleted successfully.");
                        } catch (error) {
                            toast.error("Error deleting PIN.");
                        } finally {
                            setLoading(false);
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
        <div className="p-6 flex justify-center items-center">
            <ToastContainer autoClose={3000} position="top-center" />

            <div className="bg-white p-8 border-2 border-dashed border-gray-300 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
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
                        {loading ? (
                            <TailSpin color="#fff" height={20} width={20} />
                        ) : (
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