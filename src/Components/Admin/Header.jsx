import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleChevronDown,
  faUserCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <img
              src="/src/assets/logo.png"
              className="h-10 me-3"
              alt="FlowBite Logo"
            />
          </div>
          <div className="flex items-center">
            <div className="relative ms-3">
              <div className="group rounded-full overflow-hidden w-20 bg-white transition duration-300">
                <button
                  type="button"
                  className="flex text-sm bg-grey-300 rounded-full  "
                  aria-expanded={showDropdown ? "true" : "false"}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-12 h-12 rounded-full"
                    src="/src/assets/userImg.png"
                    alt="user photo"
                  />
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className={`ml-2 py-4 text-slate-700 ${showDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {showDropdown && (
                  <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-lg">
                    <li>
                      <button className="block py-2 px-4  dark:text-grey-300 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left">
                        <FontAwesomeIcon icon={faUserCog} className="me-2" />
                        Admin
                      </button>
                    </li>
                    <li>
                      <button className="block py-2 px-4  dark:text-grey-300 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left">
                        <FontAwesomeIcon
                          icon={faSignOutAlt}
                          className="me-2"
                        />
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
