import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faBook,
  faClipboardList,
  faTachometerAlt,
  faSignOutAlt,
  faBars,
  faHome
} from "@fortawesome/free-solid-svg-icons";

function SideNav(props) {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <img
            src="/src/assets/logo.png"
            className="h-8 w-auto"
            alt="Logo"
          />
          <button className="lg:hidden">
            <FontAwesomeIcon icon={faBars} className="text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-white ${location.pathname === "/admin/dashboard"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
                  }`}
              >
                <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-2" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/level-sections"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-white ${location.pathname === "/admin/level-sections"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
                  }`}
              >
                <FontAwesomeIcon icon={faBook} className="w-5 h-5 mr-2" />
                <span>Level & Sections</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/teachers"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-white ${location.pathname === "/admin/teachers"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
                  }`}
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} className="w-5 h-5 mr-2" />
                <span>Teacher</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/attendance-report"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-white ${location.pathname === "/admin/attendance-report"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
                  }`}
              >
                <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5 mr-2" />
                <span>Attendance Report</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <NavLink
            to="/login"
            className="flex items-center justify-center w-full px-4 py-2 ring-1 ring-slate-700 rounded-md focus:outline-none focus:ring focus:ring-slate-300 hover:ring-2 transition-transform"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
