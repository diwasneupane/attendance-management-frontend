import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaChartBar,
  FaCog,
  FaKey,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
  FaChevronCircleLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const sidebarItems = [
  { name: "Dashboard", icon: FaHome, color: "text-indigo-600", route: "/admin/dashboard" },
  {
    name: "Level & Sections",
    icon: FaUsers,
    color: "text-blue-600",
    route: "/admin/level-sections",
  },
  {
    name: "Teachers",
    icon: FaChalkboardTeacher,
    color: "text-green-600",
    route: "/admin/teachers",
  },
  {
    name: "Attendance Report",
    icon: FaChartBar,
    color: "text-orange-600",
    route: "/admin/attendance-report",
  },
  {
    name: "Admin Settings",
    icon: FaCog,
    color: "text-red-600",
    route: "/admin/change-password",
  },
  {
    name: "Change PIN",
    icon: FaKey,
    color: "text-yellow-600",
    route: "/admin/change-pin",
  },
];

const hoverEffect = {
  scale: 1.2,
  transition: { duration: 0.3, ease: "easeInOut" },
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const barAnimation = {
    x: [1, -10,],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: 1,
      ease: 'easeInOut',
    },
  };
  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    collapsed: {
      width: "4rem",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    confirmAlert({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const authToken = localStorage.getItem("authToken");

              await axios.post(
                "http://localhost:3000/api/v1/admin/admin-logout",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`, // Pass the token
                  },
                }
              );

              localStorage.removeItem("authToken"); // Clear local storage

              toast.success("Logged out successfully."); // Success message
              navigate("/login"); // Redirect to login
              window.location.reload()
            } catch (error) {
              if (error.response && error.response.status === 401) {
                // Token expired, log user out
                logout();
              } else {
                console.error("Error during logout:", error);
                toast.error("Failed to log out. Please try again."); // Error message
              }
            }
          },
        },
        {
          label: 'No', // Cancel button
          onClick: () => {
            toast.info("Logout canceled."); // Info message
          },
        },
      ],
    });
  };
  const logout = () => {
    // Define your logout logic here
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  };
  return (
    <motion.div
      initial={collapsed ? "collapsed" : "expanded"}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className="flex flex-col h-screen bg-white text-gray-800"
      style={{ boxShadow: "2px 0px 1px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div
        className="flex items-center justify-between h-16 px-4 cursor-pointer"
        onClick={toggleSidebar}
        style={{
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
          borderRightWidth: "3px",
          borderRightColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRightColor = "indigo";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRightColor = "transparent";
        }}
      >
        {collapsed ? (
          <FaBars className="text-2xl text-indigo-600" />
        ) : (
          <>
            <motion.div
              whileHover={hoverEffect}
              className="flex items-center"
            >
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </motion.div>
            <motion.div
              animate={barAnimation}
              className="flex items-center justify-center"
            >
              <FaChevronCircleLeft className="text-2xl text-indigo-600" />
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="flex flex-col mt-4">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            className="relative p-3 transition-colors cursor-pointer flex items-center "

            style={{
              borderRightWidth: "3px",
              borderRightColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderRightColor = "indigo";
              e.currentTarget.style.boxShadow = "2px 0 10px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderRightColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <motion.div whileHover={hoverEffect} className="flex items-center">
              <item.icon className={item.color} />
            </motion.div>
            {!collapsed && <span className="ml-2 text-sm">{item.name}</span>}
          </Link>
        ))}
      </div>

      <motion.div className="border-t border-gray-300 my-4"></motion.div>

      <Link
        className="mt-auto p-3 relative flex items-center cursor-pointer"
        style={{
          borderRightWidth: "3px",
          borderRightColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRightColor = "indigo";
          e.currentTarget.style.boxShadow = "2px 0 10px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRightColor = "transparent";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <motion.div
          whileHover={hoverEffect}
          className="p-3 relative flex items-center cursor-pointer"
          onClick={handleLogout} // Call logout handler
        >
          <FaSignOutAlt className="text-red-600" />
          {!collapsed && <span className="ml-2 text-sm">Logout</span>}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Sidebar;
