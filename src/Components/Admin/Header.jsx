import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleChevronDown, faUserCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../../Auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1/";

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const closeDropdown = () => {
    if (showDropdown) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${baseURL}/admin/admin-logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("authToken");


      toast.info("You've successfully logged out. We hope to see you back soon!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "👋",
      });

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="px-5 py-4 lg:px-10 flex justify-between items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="p-3 text-gray-500 rounded-lg hover:bg-gray-100"
              onClick={toggleSidebar} // Toggle the sidebar on smaller screens
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <img src="/src/assets/logo.png" className="h-8 mx-3" alt="Logo" />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center p-2 rounded-full hover:bg-gray-200"
              onClick={toggleDropdown}
            >
              <img
                className="w-10 h-10 rounded-full"
                src="/src/assets/userImg.png"
                alt="User"
              />
              <FontAwesomeIcon
                icon={faCircleChevronDown}
                className={`ml-2 ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>
            {showDropdown && (
              <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                <li>
                  <button
                    className="block py-2 px-4 hover:bg-gray-200 w-full text-left"
                    onClick={() => {
                      navigate("/admin/change-password");
                      closeDropdown();
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCog} />
                    Admin Setting
                  </button>
                </li>
                <li>
                  <button
                    className="block py-2 px-4 hover:bg-gray-200 w-full text-left"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
