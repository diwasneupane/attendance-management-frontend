import React from "react";
import Header from "./Components/Admin/Header.jsx";
import SideNav from "./Components/Admin/SideNav.jsx";
import { Outlet } from "react-router-dom";

const HEADER_HEIGHT = 640; // Adjust to match the height of your Header

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Outlet />
            <div className="flex flex-1" style={{ marginTop: HEADER_HEIGHT }}>
                <SideNav className="w-64 fixed" style={{ top: HEADER_HEIGHT }} />
                <div className="flex-1 ml-64">
                </div>
            </div>
        </div>
    );
}

export default Layout;
