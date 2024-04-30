import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png'; // Correct path to your logo image

function Header({ sidebarOpen }) {
  const expandedSidebarWidth = '16rem'; // Width of expanded sidebar
  const collapsedSidebarWidth = '4rem'; // Width of collapsed sidebar

  const sidebarWidth = sidebarOpen ? expandedSidebarWidth : collapsedSidebarWidth;

  return (
    <motion.div
      className="flex justify-end items-center h-16 bg-white z-50 px-6  border-gray-300"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{ marginLeft: sidebarWidth }} // Adjust margin-left based on sidebar state
    >
      <div className="flex items-center pr-4"> {/* Profile icon and logo */}
        <UserCircleIcon className="h-8 w-8 text-[#0141CF]" />
        <span className="mr-4  font-bold text-[#FFA500]">AdminEliteCA</span> {/* Username */}
        <div className="border-l-2 border-gray-300 pl-4"> {/* Border between sections */}
          <img
            src={logo}
            alt="Elite Attendance Logo"
            className="h-10 w-auto" // Adjusted size for the logo
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Header;
