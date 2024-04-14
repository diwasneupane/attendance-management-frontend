import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = (e) => {
        e.preventDefault(); // Prevent form submission

        // Check if email and password are not empty
        if (!email.trim() || !password.trim()) {
            alert('Please fill in both email and password fields.');
            return;
        }

        // Perform login logic here
        // For example, check credentials and authenticate the user

        // If login is successful, redirect to admin part
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="mx-auto w-1/2 mt-4">
                <img className="mx-auto h-15 w-auto" src="/src/assets/logo.png" alt="Workflow" />
                <div className="border-b border-solid border-gray-300"></div>
            </div>
            <div className="mx-auto w-full max-w-md flex-grow">
                <div className="bg-white py-8 px-4 shadow-xl md:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 placeholde:true ">
                                User Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="atext-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300shadow-md focus:bg-white focus:border-slate-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 ">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="atext-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300shadow-md focus:bg-white focus:border-slate-600 focus:outline-none"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 px-3 py-2" onClick={togglePasswordVisibility}>
                                    <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <Link to="/admin/dashboard">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign in
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
