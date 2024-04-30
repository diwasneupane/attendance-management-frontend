import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getAuthToken } from "../../Auth"; // Function to get auth token from local storage

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (field) => {
        if (field === "current") {
            setShowCurrentPassword(!showCurrentPassword);
        } else if (field === "new") {
            setShowNewPassword(!showNewPassword);
        } else if (field === "confirm") {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password must match.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("New password cannot be the same as the current password.");
            return;
        }

        try {
            const authToken = getAuthToken(); // Retrieve the token from local storage

            await axios.patch(
                "http://localhost:3000/api/v1/admin/admin-updatePassword", // Endpoint for password update
                {
                    oldPassword: currentPassword,
                    newPassword,
                    confirmPassword, // Ensure this field is included in the request
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Add the token to the headers
                    },
                }
            );

            toast.success("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Authorization error. Please log in again.");
            } else {
                toast.error("Error changing password.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center py-10 bg-gray-50">
            <ToastContainer autoClose={3000} position="top-right" />
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-[#0141CF]">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700" htmlFor="currentPassword">
                            Current Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("current")}
                                className="p-2 text-gray-600"
                            >
                                <FontAwesomeIcon
                                    icon={showCurrentPassword ? faEyeSlash : faEye}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700" htmlFor="newPassword">
                            New Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="p-2 text-gray-600"
                            >
                                <FontAwesomeIcon
                                    icon={showCurrentPassword ? faEyeSlash : faEye}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="p-2 text-gray-600"
                            >
                                <FontAwesomeIcon
                                    icon={showCurrentPassword ? faEyeSlash : faEye}
                                />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#0141CF] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ease-in-out"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
