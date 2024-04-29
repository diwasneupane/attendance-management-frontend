import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // Import framer-motion for animations

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center space-y-6"> {/* Center the content vertically */}
            {/* Animation for the 404 heading */}
            <motion.h1
                className="text-6xl font-bold text-red-500"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                404
            </motion.h1>

            {/* Animation for the message */}
            <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                Oops! The page you're looking for doesn't exist.
            </motion.p>

            {/* Bounce animation for the icon */}
            <motion.div
                className="animate-bounce"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <svg
                    className="h-16 w-16 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" // Define the icon path
                    />
                </svg>
            </motion.div>

            {/* Add additional information */}
            <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                You might want to check the URL or return to the homepage.
            </motion.p>

            {/* Create a button to navigate back to the home page */}
            <Link to="/" className="mt-4">
                <motion.button
                    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    whileHover={{ scale: 1.1 }} // Animation on hover
                    whileTap={{ scale: 0.95 }} // Animation on click
                >
                    <FontAwesomeIcon icon={faHome} className="mr-2" /> {/* Icon for the button */}
                    Go Back to Home
                </motion.button>
            </Link>
        </div>
    );
};

export default NotFound;
