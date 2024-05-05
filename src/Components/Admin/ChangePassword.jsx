import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getAuthToken } from "../../Auth"; // Function to get auth token from local storage
import { TailSpin } from 'react-loader-spinner'; // Import TailSpin loader

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

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
        setLoading(true); // Set loading state to true when submitting the form

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required.");
            setLoading(false); // Reset loading state
            return;
        }

        if (newPassword === currentPassword) {
            toast.error("New password cannot be the same as the old password.");
            setLoading(false); // Reset loading state
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            setLoading(false); // Reset loading state
            return;
        }

        try {
            const authToken = getAuthToken();

            await axios.patch(
                "http://localhost:3000/api/v1/admin/admin-updatePassword",
                {
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
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
        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    return (
        <div className="flex justify-center items-center py-8">
            <ToastContainer autoClose={3000} position="top-right" />
            <div className="max-w-md w-full p-8 bg-white rounded-lg border-2 border-dashed shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-[#0141CF]">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 pb-2" htmlFor="currentPassword">
                            Current Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full p-3 border-2 border-black rounded-lg"
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
                        <label className="block text-gray-700 pb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full p-3 border-2 border-black rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="p-2 text-gray-600"
                            >
                                <FontAwesomeIcon
                                    icon={showNewPassword ? faEyeSlash : faEye}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 pb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-3 border-2 border-black rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="p-2 text-gray-600"
                            >
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#0141CF] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ease-in-out"
                        disabled={loading} // Disable button when loading is true
                    >
                        {loading ? <TailSpin color="#fff" height={20} width={20} /> : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
