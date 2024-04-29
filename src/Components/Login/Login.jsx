import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password must be at least 6 characters'),
});

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';

    const axiosInstance = axios.create({
        baseURL,
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validateForm = () => {
        try {
            validationSchema.validateSync({ username, password });
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post('admin/admin-login', { username, password });

            const { accessToken } = response.data.data;

            if (!accessToken) {
                throw new Error('Access token is undefined');
            }

            localStorage.setItem('authToken', accessToken);
            toast.success('Login successful!');

            navigate('/admin/dashboard', { replace: true });
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';

            if (error.response) {
                const { status, data } = error.response;

                if (status === 404) {
                    errorMessage = 'Admin not found. Please check your username.';
                } else if (status === 400) {
                    errorMessage = data.message || 'Invalid credentials. Please try again.';
                }
            } else {
                errorMessage = error.message || errorMessage;
            }

            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <ToastContainer />
            {isLoading && (
                <TailSpin color="#4A90E2" height={80} width={80} />
            )}
            <div className="mx-auto w-1/2 mt-4">
                <img className="mx-auto h-15 w-auto" src="/src/assets/logo.png" />
                <div className="border-b border-solid border-gray-300"></div>
            </div>
            <div className="mx-auto w-full max-w-md flex-grow">
                <div className="bg-white py-8 px-4 shadow-xl md:rounded-lg sm:px-10">
                    <form onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-3"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <div style={{ paddingTop: '1rem' }}>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
