import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons'; // Import an icon for the navigation button

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center space-y-6"> {/* Center the content vertically */}
            <h1 className="text-6xl font-semibold text-red-500">404</h1> {/* Large, bold text for the 404 heading */}
            <p className="text-lg text-gray-600">Oops! Looks like you're lost.</p> {/* Message text */}
            <div className="animate-bounce"> {/* Add bounce animation to the icon */}
                <svg
                    className="mx-auto h-16 w-16 text-red-500" /* Center the icon and set size and color */
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /* Define the icon path */
                    />
                </svg>
            </div>
            <p className="text-gray-600"> {/* Additional text with Tailwind styling */}
                Let's get you back to safety.
            </p>
            <Link
                to="/" /* Navigation link to the home page */
                className="flex items-center justify-center text-red-500 underline text-lg hover:text-red-600 transition duration-300"
            >
                <FontAwesomeIcon icon={faHome} className="mr-2" /> {/* Add an icon to the button */}
                Go back to Home {/* Button text */}
            </Link>
        </div>
    );
};

export default NotFound;
