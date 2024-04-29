import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleChevronDown,
  faUserCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
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

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            localStorage.removeItem("authToken");
            navigate("/login", { replace: true });
            window.location.reload(); // Optional, to refresh the application state
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing, just close the confirmation dialog
          },
        },
      ],
    });
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="px-5 py-4 lg:px-10 flex justify-between items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="p-3 text-gray-500 rounded-lg hover:bg-gray-100"
              onClick={toggleSidebar}
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
                      setShowDropdown(false);
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
